from enum import Enum

from pydantic import BaseModel


class Language(str, Enum):
    en = "en"
    es = "es"


class PosTag(str, Enum):
    """Universal POS tags.
    See https://universaldependencies.org/ for more information.
    """

    ADJ = "ADJ"
    ADP = "ADP"
    PUNCT = "PUNCT"
    ADV = "ADV"
    AUX = "AUX"
    SYM = "SYM"
    INTJ = "INTJ"
    CCONJ = "CCONJ"
    X = "X"
    NOUN = "NOUN"
    DET = "DET"
    PROPN = "PROPN"
    NUM = "NUM"
    VERB = "VERB"
    PART = "PART"
    PRON = "PRON"
    SCONJ = "SCONJ"


class SpacyToken(BaseModel):
    text: str
    pos: PosTag
    lemma: str
    is_sent_start: bool
