import modal
from modal import Secret, asgi_app

from ml.apps_v2.utils import create_app, get_web_image

image = modal.Image.debian_slim().pip_install(
    ["torch", "sentencepiece", "transformers"]
)

app = modal.App("apps-v2-flan-t5", image=image)

MODEL_ID = "google/flan-t5-base"
USE_GPU = False
BATCH_SIZE = 32 if USE_GPU else 4

with image.imports():
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


@app.cls(
    gpu=modal.gpu.A10G() if USE_GPU else None,
    enable_memory_snapshot=True,
    concurrency_limit=1,
)
class FlanT5:
    batch_size = BATCH_SIZE
    model_id = MODEL_ID
    normalize_embeddings = True

    @modal.build()
    def build(self):
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID)
        tokenizer.save_pretrained("/tokenizer")
        model.save_pretrained("/model")

    @modal.enter(snap=True)
    def load(self):
        # Create a memory snapshot with the model loaded in CPU memory.
        self.tokenizer = AutoTokenizer.from_pretrained("/tokenizer")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("/model")

    @modal.enter(snap=False)
    def setup(self):
        # Move the model to a GPU before doing any work.
        if USE_GPU:
            self.model.to("cuda")

    @modal.method()
    def run(self, prompts: list[str]):
        input_ids = self.tokenizer(prompts, return_tensors="pt", padding=True).input_ids

        outputs = self.model.generate(input_ids, max_new_tokens=256)
        return [
            self.tokenizer.decode(output, skip_special_tokens=True)
            for output in outputs
        ]


##########################################################
# web endpoint
##########################################################

web_image = get_web_image()
web_app = create_app(auth=False)


@web_app.post("/run")
async def run(prompts: list[str]):
    return FlanT5.run.remote(prompts)


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
