import pandas as pd
import spacy
from tqdm import tqdm

from ml.research.models import PosTag
from ml.research.vocab.models import VocabItem
from ml.utils import write_jsonlines

RAW_CSV_PATH = "ml/research/vocab/data/spanish-5000-raw.csv"
CLEAN_JSONL_PATH = "ml/research/vocab/data/spanish-5000.jsonl"
SPACY_MODEL_NAME = "es_core_news_md"

# load the spacy model (and download it if it doesn't exist)
try:
    nlp = spacy.load(SPACY_MODEL_NAME)
except OSError:
    import spacy.cli

    spacy.cli.download(SPACY_MODEL_NAME)
    nlp = spacy.load(SPACY_MODEL_NAME)


# constants
SPANISH_REPLACEMENTS = {
    "&nbsp;": " ",
    ": ": "; ",
    " :": "; ",
    "<br />": "; ",
    "<br>": "; ",
    "  ": " ",
    "<div>": "",
    "</div>": "",
}

ENGLISH_REPLACEMENTS = {
    "<div>": "",
    "</div>": "",
}

CSV_POS_TAG_MAPPING = {
    " (v)": "verb",
    " (prep)": "preposition",
    " (conj)": "conjunction",
    " (adv)": "adverb",
    " (nf)": "noun (feminine)",
    " (nm)": "noun (masculine)",
    " (nm/f)": "noun (masculine/feminine)",
    " (num)": "number",
    " (pron)": "pronoun",
    " (adj)": "adjective",
    " (nc)": "noun (common)",
    " (nf el)": "noun (feminine) (el)",
    " (nmf)": "noun (masculine/feminine)",
    " (interj)": "interjection",
    " (n)": "noun",
    " (adj, adv)": "adjective, adverb",
    " (adj, pron)": "adjective, pronoun",
    " (adj pron)": "adjective, pronoun",
    " (art)": "article",
}

CSV_POS_TO_UNIVERSAL_POS = {
    "verb": PosTag.VERB,
    "preposition": PosTag.ADP,
    "conjunction": PosTag.CCONJ,
    "adverb": PosTag.ADV,
    "noun (feminine)": PosTag.NOUN,
    "noun (masculine)": PosTag.NOUN,
    "noun (masculine/feminine)": PosTag.NOUN,
    "number": PosTag.NUM,
    "pronoun": PosTag.PRON,
    "adjective": PosTag.ADJ,
    "noun (common)": PosTag.NOUN,
    "noun (feminine) (el)": PosTag.NOUN,
    "interjection": PosTag.INTJ,
    "noun": PosTag.NOUN,
    "adjective, adverb": PosTag.ADJ,
    "adjective, pronoun": PosTag.ADJ,
    "article": PosTag.DET,
}


def read_csv(path: str) -> list[dict]:
    df = pd.read_csv(path)
    vocab: list[dict] = []
    for _, row in tqdm(df.iterrows(), desc="Reading rows..."):
        vocab.append(
            {
                "english": row["English"],
                "spanish": row["Spanish"],
                "ranking": int(row["Ranking"]),
            }
        )
    return vocab


def clean_vocab(vocab: list[dict]) -> list[dict]:
    cleaned_vocab = []
    for vocab_item in tqdm(vocab, desc="Cleaning vocab..."):
        spanish = vocab_item["spanish"].strip()
        english = vocab_item["english"].strip()

        for k, v in SPANISH_REPLACEMENTS.items():
            spanish = spanish.replace(k, v)

        for k, v in ENGLISH_REPLACEMENTS.items():
            english = english.replace(k, v)

        cleaned_vocab.append(
            {
                **vocab_item,
                "english": english,
                "spanish": spanish,
            }
        )
    return cleaned_vocab


def add_vocab_pos_tags(vocab: list[dict]) -> list[dict]:
    pos_vocab: list[dict] = []
    for vocab_item in tqdm(vocab, desc="Adding POS tags..."):
        spanish = vocab_item["spanish"]

        # find the CSV tag (and remove from the spanish parts)
        pos_tag_csv = None
        for k, v in CSV_POS_TAG_MAPPING.items():
            if k in spanish:
                pos_tag_csv = v
                spanish = spanish.replace(k, "")
                break
        if pos_tag_csv is None:
            raise ValueError(f"POS tag not found for {spanish}")

        # remove any POS tags in the english part
        english = vocab_item["english"]
        for k in CSV_POS_TAG_MAPPING.keys():
            english = english.replace(k, "")

        pos_tag = str(CSV_POS_TO_UNIVERSAL_POS[pos_tag_csv].value)
        pos_vocab.append(
            {**vocab_item, "pos": pos_tag, "english": english, "spanish": spanish}
        )

    return pos_vocab


def add_vocab_lemmas(vocab: list[dict]) -> list[dict]:
    lemma_vocab: list[dict] = []
    for vocab_item in tqdm(vocab, desc="Adding Lemmas..."):
        lemma = None
        doc = nlp(vocab_item["spanish"])
        if len(doc) == 1 and doc[0].pos_ == vocab_item["pos"]:
            lemma = doc[0].lemma_
        lemma_vocab.append({**vocab_item, "spanish_lemma": lemma})
    return lemma_vocab


def vocab_dicts_to_models(vocab: list[dict]) -> list[VocabItem]:
    return [VocabItem(**vocab_item, attributes=[]) for vocab_item in vocab]


def main():
    # read in raw csv file into a list of dicts
    raw_vocab = read_csv(RAW_CSV_PATH)

    # clean the spanish and english parts of each item
    cleaned_vocab = clean_vocab(raw_vocab)

    # add a 'pos' key to each vocab item
    pos_vocab = add_vocab_pos_tags(cleaned_vocab)

    # add lemmas to vocab where approriate
    lemma_vocab = add_vocab_lemmas(pos_vocab)

    # convert to VocabItem objects
    vocab = vocab_dicts_to_models(lemma_vocab)

    # save to outfile
    write_jsonlines(CLEAN_JSONL_PATH, vocab)


if __name__ == "__main__":
    main()
