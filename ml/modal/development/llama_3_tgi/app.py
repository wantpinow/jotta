import os
import subprocess

from modal import App, Image, Secret, asgi_app, enter, exit, gpu, method

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
MODEL_REVISION = "7840f95a8c7a781d3f89c4818bf693431ab3119a"

LAUNCH_FLAGS = [
    "--model-id",
    MODEL_ID,
    "--port",
    "8000",
    "--revision",
    MODEL_REVISION,
]


def download_model():
    subprocess.run(
        [
            "text-generation-server",
            "download-weights",
            MODEL_ID,
            "--revision",
            MODEL_REVISION,
            "--dtype",
            "float16",
            "--max-concurrent-requests",
            "128",
        ],
    )


app = App("llama-3-tgi")

tgi_image = (
    Image.from_registry("ghcr.io/huggingface/text-generation-inference:1.4")
    .dockerfile_commands("ENTRYPOINT []")
    .run_function(
        download_model,
        secrets=[Secret.from_name("huggingface-secret")],
        timeout=3600,
    )
    .pip_install("text-generation")
)


N_GPUS = 1
GPU_CONFIG = gpu.A100(count=N_GPUS)


@app.cls(
    secrets=[Secret.from_name("huggingface-secret")],
    gpu=GPU_CONFIG,
    allow_concurrent_inputs=128,
    container_idle_timeout=60 * 10,
    timeout=60 * 60,
    image=tgi_image,
)
class Model:
    @enter()
    def start_server(self):
        import socket
        import time

        from text_generation import AsyncClient

        self.launcher = subprocess.Popen(
            ["text-generation-launcher"] + LAUNCH_FLAGS,
            env={
                **os.environ,
                "HUGGING_FACE_HUB_TOKEN": os.environ["HF_TOKEN"],
            },
        )
        self.client = AsyncClient("http://127.0.0.1:8000", timeout=60)
        self.template = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

{user}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""

        # Poll until webserver at 127.0.0.1:8000 accepts connections before running inputs.
        def webserver_ready():
            try:
                socket.create_connection(("127.0.0.1", 8000), timeout=1).close()
                return True
            except (socket.timeout, ConnectionRefusedError):
                # Check if launcher webserving process has exited.
                # If so, a connection can never be made.
                retcode = self.launcher.poll()
                if retcode is not None:
                    raise RuntimeError(
                        f"launcher exited unexpectedly with code {retcode}"
                    )
                return False

        while not webserver_ready():
            time.sleep(1.0)

        print("Webserver ready!")

    @exit()
    def terminate_server(self):
        self.launcher.terminate()

    @method()
    async def generate(self, question: str):
        prompt = self.template.format(user=question)
        result = await self.client.generate(
            prompt, max_new_tokens=1024, stop_sequences=["<|eot_id|>"]
        )

        return result.generated_text

    @method()
    async def generate_stream(self, question: str):
        prompt = self.template.format(user=question)

        async for response in self.client.generate_stream(
            prompt, max_new_tokens=1024, stop_sequences=["<|eot_id|>"]
        ):
            if not response.token.special and response.token.text != "<|eot_id|>":
                yield response.token.text


@app.function(
    keep_warm=1,
    allow_concurrent_inputs=1,
    timeout=60 * 10,
)
@asgi_app(label="llama3")
def tgi_app():
    import json

    import fastapi
    import fastapi.staticfiles
    from fastapi.responses import StreamingResponse

    web_app = fastapi.FastAPI()

    @web_app.get("/stats")
    async def stats():
        stats = await Model().generate_stream.get_current_stats.aio()
        return {
            "backlog": stats.backlog,
            "num_total_runners": stats.num_total_runners,
            "model": MODEL_ID,
        }

    @web_app.get("/completion/{question}")
    async def completion(question: str):
        from urllib.parse import unquote

        async def generate():
            async for text in Model().generate_stream.remote_gen.aio(unquote(question)):
                yield f"data: {json.dumps(dict(text=text), ensure_ascii=False)}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    return web_app
