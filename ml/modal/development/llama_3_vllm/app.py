import os
import time

import modal

MODEL_DIR = "/model"
MODEL_NAME = "meta-llama/Meta-Llama-3-8B-Instruct"


def download_model_to_image(model_dir, model_name):
    from huggingface_hub import snapshot_download
    from transformers.utils import move_cache

    os.makedirs(model_dir, exist_ok=True)

    snapshot_download(
        model_name,
        local_dir=model_dir,
        ignore_patterns=["*.pt", "*.bin"],  # Using safetensors
        token=os.environ["HF_TOKEN"],
    )
    move_cache()


image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install(
        "vllm==0.4.0.post1",
        "torch==2.1.2",
        "transformers==4.39.3",
        "ray==2.10.0",
        "hf-transfer==0.1.6",
        "huggingface_hub==0.22.2",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .run_function(
        download_model_to_image,
        timeout=60 * 20,
        kwargs={"model_dir": MODEL_DIR, "model_name": MODEL_NAME},
        secrets=[modal.Secret.from_name("huggingface-secret")],
    )
)

app = modal.App("llama-3-vllm", image=image)

with image.imports():
    import vllm

GPU_CONFIG = modal.gpu.A100(count=1)  # 40GB A100 by default


@app.cls(gpu=GPU_CONFIG, concurrency_limit=1, allow_concurrent_inputs=1)
class Model:
    @modal.enter()
    def load_model(self):
        # Tip: models that are not fully implemented by Hugging Face may require `trust_remote_code=true`.
        self.llm = vllm.LLM(MODEL_DIR, tensor_parallel_size=GPU_CONFIG.count)
        self.template = """[INST] <<SYS>>
{system}
<</SYS>>

{user} [/INST]"""

    @modal.method()
    def generate(self, user_questions):
        prompts = [self.template.format(system="", user=q) for q in user_questions]

        sampling_params = vllm.SamplingParams(
            temperature=0.75,
            top_p=1,
            max_tokens=256,
            presence_penalty=1.15,
        )
        start = time.monotonic_ns()
        result = self.llm.generate(prompts, sampling_params)
        duration_s = (time.monotonic_ns() - start) / 1e9
        num_tokens = 0

        COLOR = {
            "HEADER": "\033[95m",
            "BLUE": "\033[94m",
            "GREEN": "\033[92m",
            "RED": "\033[91m",
            "ENDC": "\033[0m",
        }

        for output in result:
            num_tokens += len(output.outputs[0].token_ids)
            print(
                f"{COLOR['HEADER']}{COLOR['GREEN']}{output.prompt}",
                f"\n{COLOR['BLUE']}{output.outputs[0].text}",
                "\n\n",
                sep=COLOR["ENDC"],
            )
            time.sleep(0.01)
        print(
            f"{COLOR['HEADER']}{COLOR['GREEN']}Generated {num_tokens} tokens from {MODEL_NAME} in {duration_s:.1f} seconds,"
            f" throughput = {num_tokens / duration_s:.0f} tokens/second on {GPU_CONFIG}.{COLOR['ENDC']}"
        )
