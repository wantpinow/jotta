import modal

image = modal.Image.debian_slim().pip_install("sentence-transformers")

app = modal.App("embed-new-test", image=image)

USE_GPU = False

with image.imports():
    from sentence_transformers import SentenceTransformer


@app.cls(
    gpu=modal.gpu.A10G() if USE_GPU else None,
    enable_memory_snapshot=True,
)
class Embedder:
    model_id = "thenlper/gte-base"

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
        embeddings = self.model.encode(sentences, normalize_embeddings=True)
        return embeddings.tolist()

    @modal.method()
    def ping(self):
        return "pong"
