import modal
from modal import Secret, asgi_app

from ml.apps_v2.utils import create_app, get_web_image

image = modal.Image.debian_slim().pip_install(["sentence-transformers"])

app = modal.App("apps-v2-embed", image=image)

MODEL_ID = "thenlper/gte-base"
USE_GPU = True
BATCH_SIZE = 256 if USE_GPU else 32

with image.imports():
    from sentence_transformers import SentenceTransformer


@app.cls(
    gpu=modal.gpu.A10G() if USE_GPU else None,
    enable_memory_snapshot=True,
    concurrency_limit=1,
)
class Embedder:
    batch_size = BATCH_SIZE
    model_id = MODEL_ID
    normalize_embeddings = True

    @modal.build()
    def build(self):
        model = SentenceTransformer(self.model_id)
        model.save("/model.gte")

    @modal.enter(snap=True)
    def load(self):
        # Create a memory snapshot with the model loaded in CPU memory.
        self.model = SentenceTransformer("/model.gte", device="cpu")

    @modal.enter(snap=False)
    def setup(self):
        # Move the model to a GPU before doing any work.
        if USE_GPU:
            self.model.to("cuda")

    @modal.method()
    def run(self, sentences: list[str]):
        embeddings = self.model.encode(
            sentences,
            normalize_embeddings=self.normalize_embeddings,
            batch_size=self.batch_size,
        )
        return embeddings.tolist()


##########################################################
# web endpoint
##########################################################

web_image = get_web_image()
web_app = create_app(auth=False)


@web_app.post("/run")
async def run(sentences: list[str]):
    return Embedder.run.remote(sentences)


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
