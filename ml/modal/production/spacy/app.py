import modal

from ml.modal.production.spacy.models import Language

SPANISH_MODEL_NAME = "es_core_news_md"
ENGLISH_MODEL_NAME = "en_core_web_md"

##########################################################
# image
##########################################################

image = modal.Image.debian_slim().pip_install("spacy")


with image.imports():
    import spacy
    import spacy.cli


##########################################################
# modal app
##########################################################

app = modal.App("spacy", image=image)


@app.cls(
    enable_memory_snapshot=True,
)
class SpacyPipeline:
    model_id = "thenlper/gte-base"

    @modal.build()
    def build(self):
        spacy.cli.download(SPANISH_MODEL_NAME)
        spacy.cli.download(ENGLISH_MODEL_NAME)

    @modal.enter(snap=True)
    def load(self):
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
