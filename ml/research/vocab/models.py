from pydantic import BaseModel

from ml.research.models import PosTag


class VocabItemAttribute(BaseModel):
    key: str
    value: str
    embedding: list[float]


class VocabItem(BaseModel):
    english: str
    spanish: str
    pos: PosTag
    spanish_lemma: str | None
    ranking: int
    attributes: list[VocabItemAttribute]
