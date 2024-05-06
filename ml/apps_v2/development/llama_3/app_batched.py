import asyncio
import json
import typing

import modal
from fastapi import Request
from litellm.utils import Message as LiteLLMMessage
from litellm.utils import TextCompletionResponse
from modal import Secret, asgi_app
from pydantic import BaseModel

from ml.apps_v2.utils import create_app, get_web_image

##########################################################
# constants
##########################################################

MODEL_DIR = "/root/model/model_input"
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
MODEL_REVISION = "7840f95a8c7a781d3f89c4818bf693431ab3119a"  # pin model revisions to prevent unexpected changes!
GIT_HASH = "71d8d4d3dc655671f32535d6d2b60cab87f36e87"
CHECKPOINT_SCRIPT_URL = f"https://raw.githubusercontent.com/NVIDIA/TensorRT-LLM/{GIT_HASH}/examples/llama/convert_checkpoint.py"
N_GPUS = 1  # Heads up: this example has not yet been tested with multiple GPUs
GPU_CONFIG = modal.gpu.A100(count=N_GPUS)
DTYPE = "float16"
CKPT_DIR = "/root/model/model_ckpt"
MINUTES = 60  # seconds
MAX_INPUT_LEN, MAX_OUTPUT_LEN = 1024, 1024
MAX_BATCH_SIZE = 128  # better throughput at larger batch sizes, limited by GPU RAM
ENGINE_DIR = "/root/model/model_output"
SIZE_ARGS = f"--max_batch_size={MAX_BATCH_SIZE} --max_input_len={MAX_INPUT_LEN} --max_output_len={MAX_OUTPUT_LEN}"
PLUGIN_ARGS = f"--gemm_plugin={DTYPE} --gpt_attention_plugin={DTYPE}"


def download_model():
    import os

    from huggingface_hub import snapshot_download
    from transformers.utils import move_cache

    os.makedirs(MODEL_DIR, exist_ok=True)
    snapshot_download(
        MODEL_ID,
        local_dir=MODEL_DIR,
        ignore_patterns=["*.pt", "*.bin"],  # using safetensors
        revision=MODEL_REVISION,
    )
    move_cache()


def extract_assistant_response(output_text):
    """Model-specific code to extract model responses.

    See this doc for LLaMA 3: https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/."""
    # Split the output text by the assistant header token
    parts = output_text.split("<|start_header_id|>assistant<|end_header_id|>")

    if len(parts) > 1:
        # Join the parts after the first occurrence of the assistant header token
        response = parts[1].split("<|eot_id|>")[0].strip()

        # Remove any remaining special tokens and whitespace
        response = response.replace("<|eot_id|>", "").strip()

        return response
    else:
        return output_text


##########################################################
# image
##########################################################

tensorrt_image = modal.Image.from_registry(
    "nvidia/cuda:12.1.1-devel-ubuntu22.04", add_python="3.10"
)

tensorrt_image = tensorrt_image.apt_install(
    "openmpi-bin", "libopenmpi-dev", "git", "git-lfs", "wget"
).pip_install(
    "tensorrt_llm==0.10.0.dev2024042300",
    pre=True,
    extra_index_url="https://pypi.nvidia.com",
)

tensorrt_image = (  # update the image by downloading the model we're using
    tensorrt_image.pip_install(  # add utilities for downloading the model
        "hf-transfer==0.1.6", "huggingface_hub==0.22.2", "requests~=2.31.0"
    )
    .env(  # hf-transfer: faster downloads, but fewer comforts
        {"HF_HUB_ENABLE_HF_TRANSFER": "1"}
    )
    .run_function(  # download the model
        download_model,
        timeout=20 * MINUTES,
        secrets=[modal.Secret.from_name("huggingface-secret")],
    )
)

tensorrt_image = (  # update the image by converting the model to TensorRT format
    tensorrt_image.run_commands(  # takes ~5 minutes
        [
            f"wget {CHECKPOINT_SCRIPT_URL} -O /root/convert_checkpoint.py",
            f"python /root/convert_checkpoint.py --model_dir={MODEL_DIR} --output_dir={CKPT_DIR}"
            + f" --tp_size={N_GPUS} --dtype={DTYPE}",
        ],
        gpu=GPU_CONFIG,  # GPU must be present to load tensorrt_llm
    )
)

tensorrt_image = (  # update the image by building the TensorRT engine
    tensorrt_image.run_commands(  # takes ~5 minutes
        [
            f"trtllm-build --checkpoint_dir {CKPT_DIR} --output_dir {ENGINE_DIR}"
            + f" --tp_size={N_GPUS} --workers={N_GPUS}"
            + f" {SIZE_ARGS}"
            + f" {PLUGIN_ARGS}"
        ],
        gpu=GPU_CONFIG,  # TRT-LLM compilation is GPU-specific, so make sure this matches production!
    ).env(  # show more log information from the inference engine
        {"TLLM_LOG_LEVEL": "INFO"}
    )
)

tensorrt_image = tensorrt_image.pip_install("fastapi", "litellm")

##########################################################
# app
##########################################################

app = modal.App("apps-v2-llama-3", image=tensorrt_image)


@app.cls(
    gpu=GPU_CONFIG,
    secrets=[modal.Secret.from_name("huggingface-secret")],
    container_idle_timeout=3 * MINUTES,
    concurrency_limit=1,
)
class Model:
    @modal.enter()
    def load(self):
        """Loads the TRT-LLM engine and configures our tokenizer.

        The @enter decorator ensures that it runs only once per container, when it starts."""
        import time

        print("\033[95m🥶 Cold boot: spinning up TRT-LLM engine\033[0m")
        self.init_start = time.monotonic_ns()

        import tensorrt_llm
        from tensorrt_llm.runtime import ModelRunner
        from transformers import AutoTokenizer

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        # LLaMA models do not have a padding token, so we use the EOS token
        self.tokenizer.add_special_tokens({"pad_token": self.tokenizer.eos_token})
        # and then we add it from the left, to minimize impact on the output
        self.tokenizer.padding_side = "left"
        self.pad_id = self.tokenizer.pad_token_id
        self.end_id = self.tokenizer.eos_token_id

        runner_kwargs = dict(
            engine_dir=f"{ENGINE_DIR}",
            lora_dir=None,
            rank=tensorrt_llm.mpi_rank(),  # this will need to be adjusted to use multiple GPUs
        )

        self.model = ModelRunner.from_dir(**runner_kwargs)

        self.init_duration_s = (time.monotonic_ns() - self.init_start) / 1e9
        print(f"\033[95m🚀 Cold boot finished in {self.init_duration_s}s\033[0m")

    @modal.method()
    def generate(self, messages: list[list[LiteLLMMessage]], settings=None):
        """Generate responses to a batch of prompts, optionally with custom inference settings."""
        import time

        if settings is None:
            settings = dict(
                temperature=0.1,  # temperature 0 not allowed, so we set top_k to 1 to get the same effect
                top_k=1,
                # stop_words_list=[
                #     # self.tokenizer.eos_token_id,
                #     self.tokenizer.convert_tokens_to_ids("<|eot_id|>"),
                # ],
                stop_token_ids=self.tokenizer.convert_tokens_to_ids(["<|eot_id|>"]),
                repetition_penalty=1.1,
                # eos_token_id=[
                #     self.tokenizer.eos_token_id,
                #     self.tokenizer.convert_tokens_to_ids("<|eot_id|>"),
                # ],
            )

        settings["max_new_tokens"] = (
            MAX_OUTPUT_LEN  # exceeding this will raise an error
        )
        settings["end_id"] = self.tokenizer.convert_tokens_to_ids("<|eot_id|>")
        settings["pad_id"] = self.pad_id

        num_prompts = len(messages)

        if num_prompts > MAX_BATCH_SIZE:
            raise ValueError(
                f"Batch size {num_prompts} exceeds maximum of {MAX_BATCH_SIZE}"
            )

        print(
            f"\033[95m🚀 Generating completions for batch of size {num_prompts}...\033[0m"
        )
        start = time.monotonic_ns()

        parsed_prompts = [
            self.tokenizer.apply_chat_template(
                prompt_messages,
                add_generation_prompt=True,
                tokenize=False,
            )
            for prompt_messages in messages
        ]

        print(
            "\033[95mParsed prompts:\033[0m",
            *parsed_prompts,
            sep="\n\t",
        )

        inputs_t = self.tokenizer(
            parsed_prompts, return_tensors="pt", padding=True, truncation=False
        )["input_ids"]

        print("\033[95mInput tensors:\033[0m", inputs_t)

        print("\033[95mSettings:\033[0m", settings)
        outputs_t = self.model.generate(inputs_t, **settings)

        outputs_text = self.tokenizer.batch_decode(
            outputs_t[:, 0]
        )  # only one output per input, so we index with 0

        # responses = [
        #     extract_assistant_response(output_text) for output_text in outputs_text
        # ]
        responses = outputs_text
        duration_s = (time.monotonic_ns() - start) / 1e9

        num_tokens = sum(map(lambda r: len(self.tokenizer.encode(r)), responses))

        print(
            f"\033[95m\033[92mGenerated {num_tokens} tokens from {MODEL_ID} in {duration_s:.1f} seconds,"
            f" throughput = {num_tokens / duration_s:.0f} tokens/second for batch of size {num_prompts} on {GPU_CONFIG}.\033[0m"
        )

        return responses


##########################################################
# web endpoint
##########################################################
Scope = typing.MutableMapping[str, typing.Any]
Message = typing.MutableMapping[str, typing.Any]
Receive = typing.Callable[[], typing.Awaitable[Message]]
Send = typing.Callable[[Message], typing.Awaitable[None]]
RequestTuple = typing.Tuple[Scope, Receive, Send]

######## batcher


class Batcher:
    def __init__(
        self, batch_max_size: int = 3, batch_max_seconds: float = 0.005
    ) -> None:
        self.batch_max_size = batch_max_size
        self.batch_max_seconds = batch_max_seconds
        self.queue = []
        self.processed: dict[int, RequestTuple] = {}
        self.timeout: float | None = None
        self.running = False

    def start_batcher(self):
        if self.running:
            return
        _ = asyncio.get_event_loop()
        self.batcher_task = asyncio.create_task(self._run_batcher())
        self.running = True

    def add_request(self, request_id: int, request: RequestTuple) -> None:
        self.queue.append((request_id, request))
        if self.timeout is None:
            self.timeout = asyncio.get_event_loop().time() + self.batch_max_seconds

    def pop_request(self, request_id: int) -> RequestTuple | None:
        if request_id in self.processed:
            return self.processed.pop(request_id)
        else:
            return None

    async def process_requests(self) -> None:
        # get a batch of requests
        batch = self.queue[: self.batch_max_size]

        # do hard work
        batch_messages = []
        for request_id, (_, receive, _) in batch:
            body = await receive()
            batch_messages.append(json.loads(body["body"].decode())["messages"])
        responses = await Model.generate.remote(batch_messages)

        # put results back in requests
        for (request_id, request), result in zip(batch, responses):
            request[0]["response"] = result
            self.processed[request_id] = request

        # remove processed requests from queue
        self.queue = [request for request in self.queue if request not in batch]

        # reset timeout if there are still requests in the queue
        if len(self.queue) > 0:
            self.timeout = asyncio.get_event_loop().time() + self.batch_max_seconds
        else:
            self.timeout = None

    async def _run_batcher(self):
        while True:
            await asyncio.sleep(0)
            if len(self.queue) >= self.batch_max_size or (
                self.timeout is not None
                and asyncio.get_event_loop().time() > self.timeout
            ):
                await self.process_requests()


######## middleware
class InterceptorMiddleware:
    def __init__(self, app, batcher: Batcher) -> None:
        self.app = app
        self.request_id: int = 0
        self.batcher = batcher
        self.batcher.start_batcher()

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        self.request_id += 1
        current_id = self.request_id

        self.batcher.add_request(current_id, (scope, receive, send))

        while True:
            request = self.batcher.pop_request(current_id)
            if not request:
                await asyncio.sleep(0)
            else:
                await self.app(request[0], request[1], request[2])
                await asyncio.sleep(0)
                return


class ChatCompletionRequest(BaseModel):
    messages: list[LiteLLMMessage]
    model: str


web_image = get_web_image()
batcher = Batcher()

web_app = create_app(auth=False)

web_app.add_middleware(InterceptorMiddleware, batcher=batcher)


@web_app.post("/chat/completions", response_model=TextCompletionResponse)
async def generate_web(request: Request, body: ChatCompletionRequest):
    # responses = Model.generate.remote([request.messages])
    return {
        "object": "chat.completion",
        "choices": [
            {
                "finish_reason": "stop",
                "index": 0,
                "message": {
                    "content": request.get("response", "no message 😭"),
                    "role": "assistant",
                },
            }
        ],
        "id": "chatcmpl-7fbd6077-de10-4cb4-a8a4-3ef11a98b7c8",
        "created": 1699290237,
        "model": "togethercomputer/llama-2-70b-chat",
        "usage": {"completion_tokens": 18, "prompt_tokens": 14, "total_tokens": 32},
    }


@app.function(
    image=web_image,
    secrets=[
        Secret.from_name("router-auth-token"),
        Secret.from_name("openai-api-key"),
    ],
    enable_memory_snapshot=True,
    concurrency_limit=1,
)
@asgi_app()
def fastapi_app():
    return web_app
