import modal

from ml.apps.spacy.models import Language

SPANISH_MODEL_NAME = "es_core_news_md"
ENGLISH_MODEL_NAME = "en_core_web_md"


def download_model_to_image(
    spanish_model_name: str = SPANISH_MODEL_NAME,
    english_model_name: str = ENGLISH_MODEL_NAME,
):
    import spacy.cli

    spacy.cli.download(spanish_model_name)
    spacy.cli.download(english_model_name)


image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("spacy")
    .run_function(
        download_model_to_image,
        timeout=60 * 20,
        kwargs={
            "spanish_model_name": SPANISH_MODEL_NAME,
            "english_model_name": ENGLISH_MODEL_NAME,
        },
    )
)


app = modal.App("spacy-cpu")


@app.cls(image=image, enable_memory_snapshot=True, concurrency_limit=1)
class Model:
    @modal.enter(snap=True)
    def start_engine(self):
        import spacy

        self.nlp_en = spacy.load(ENGLISH_MODEL_NAME)
        self.nlp_es = spacy.load(SPANISH_MODEL_NAME)

    @modal.method()
    def process(self, text: str, language: Language):
        nlp = self.nlp_es if language.value == "es" else self.nlp_en
        doc = nlp(text)
        return [
            {
                "text": token.text,
                "pos": token.pos_,
                "lemma": token.lemma_,
                "is_sent_start": token.is_sent_start,
            }
            for token in doc
        ]
