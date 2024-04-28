from enum import Enum

from pydantic import BaseModel


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


class DepTag(str, Enum):
    ROOT = "ROOT"
    ACL = "acl"
    ADVCL = "advcl"
    ADVMOD = "advmod"
    AMOD = "amod"
    APPOS = "appos"
    AUX = "aux"
    CASE = "case"
    CC = "cc"
    CCOMP = "ccomp"
    COMPOUND = "compound"
    CONJ = "conj"
    COP = "cop"
    CSUBJ = "csubj"
    DEP = "dep"
    DET = "det"
    EXPL = "expl"
    FIXED = "fixed"
    FLAT = "flat"
    IOBJ = "iobj"
    MARK = "mark"
    NMOD = "nmod"
    NSUBJ = "nsubj"
    NUMMOD = "nummod"
    OBJ = "obj"
    OBL = "obl"
    PARATAXIS = "parataxis"
    PUNCT = "punct"
    XCOMP = "xcomp"


class SpacyToken(BaseModel):
    text: str
    pos: PosTag
    dep: DepTag
    lemma: str
    is_sent_start: bool
