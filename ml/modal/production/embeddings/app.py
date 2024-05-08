import modal

USE_GPU = False

##########################################################
# image
##########################################################

image = modal.Image.debian_slim(python_version="3.12").pip_install(
    "sentence-transformers"
)


with image.imports():
    from sentence_transformers import SentenceTransformer


##########################################################
# modal app
##########################################################

app = modal.App("embeddings", image=image)


@app.cls(
    gpu=modal.gpu.A10G() if USE_GPU else None,
    enable_memory_snapshot=True,
)
class EmbeddingModel:
    model_id = "thenlper/gte-base"

    @modal.build()
    def build(self):
        model = SentenceTransformer(self.model_id)
        model.save("/model.gte")

    @modal.enter(snap=True)
    def load(self):
        self.model = SentenceTransformer("/model.gte", device="cpu")

    @modal.enter(snap=False)
    def setup(self):
        if USE_GPU:
            self.model.to("cuda")

    @modal.method()
    def embed(self, sentences: list[str]):
        embeddings = self.model.encode(sentences, normalize_embeddings=True)
        return embeddings.tolist()
