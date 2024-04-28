from concurrent.futures import ThreadPoolExecutor

import pandas as pd
import spacy
from dotenv import load_dotenv
from openai import OpenAI
from tqdm import tqdm

from ml.research.models import PosTag, pos_tag_names

RAW_DATA_PATH = "ml/research/data/vocab/spanish-5000-raw.csv"
CLEAN_DATA_PATH = "ml/research/data/vocab/spanish-5000-clean-auto.csv"
SPACY_MODEL_NAME = "es_core_news_md"

# load the spacy model (and download it if it doesn't exist)
try:
    nlp = spacy.load(SPACY_MODEL_NAME)
except OSError:
    import spacy.cli

    spacy.cli.download(SPACY_MODEL_NAME)
    nlp = spacy.load(SPACY_MODEL_NAME)

# load openai client
load_dotenv()
openai = OpenAI()

# enable progress bars for pandas
tqdm.pandas()


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


def read_csv(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


# data cleaning: remove unwanted characters
def clean_row(row: pd.Series) -> pd.Series:
    spanish = row["Spanish"]
    english = row["English"]

    for k, v in SPANISH_REPLACEMENTS.items():
        spanish = spanish.replace(k, v)

    for k, v in ENGLISH_REPLACEMENTS.items():
        english = english.replace(k, v)

    row["Spanish"] = spanish
    row["English"] = english

    return row


def clean_data(data: pd.DataFrame) -> pd.DataFrame:
    print("Cleaning data")
    return data.progress_apply(clean_row, axis=1)


# pos tagging: map csv pos tags in the 'Spanish' column to universal pos tags
def get_row_pos_tag(row: pd.Series) -> pd.Series:
    spanish = row["Spanish"]
    pos_tag_csv = None
    for k, v in CSV_POS_TAG_MAPPING.items():
        if k in spanish:
            pos_tag_csv = v
            row["Spanish"] = spanish.replace(k, "")
            break
    if pos_tag_csv is None:
        raise ValueError(f"POS tag not found for {spanish}")
    pos_tag = str(CSV_POS_TO_UNIVERSAL_POS[pos_tag_csv].value)
    row["POS Tag"] = pos_tag
    row["Raw POS Tag"] = pos_tag_csv
    return row


def add_pos_tag_column(data: pd.DataFrame) -> pd.DataFrame:
    print("Adding POS tag column")
    return data.progress_apply(get_row_pos_tag, axis=1)


# lemmitization: get the lemma of each word in the 'Spanish' column
def get_row_lemma(row: pd.Series) -> pd.Series:
    doc = nlp(row["Spanish"])
    if len(doc) != 1:
        row["Lemma"] = "Too many tokens"
        return row
    if doc[0].pos_ != row["POS Tag"]:
        row["Lemma"] = "Wrong POS"
        return row
    row["Lemma"] = doc[0].lemma_
    row["Raw Lemma"] = doc[0].lemma_
    return row


def add_lemma_column(data: pd.DataFrame) -> pd.DataFrame:
    print("Adding lemma column")
    return data.progress_apply(get_row_lemma, axis=1)


# correct "Wrong POS" rows
def correct_wrong_pos_word_lemma(spanish_word: str, pos_tag: str) -> str:
    print(spanish_word)
    pos_tag_name = pos_tag_names[pos_tag]

    # generate a response
    # https://platform.openai.com/playground/p/VM5HQs2nOAOcCL8kSZkj5smS?model=gpt-4-turbo&mode=chat
    system_prompt = "You are a world class Spanish linguist."
    user_prompt = f'Can the spanish word "{spanish_word}" be thought of as a {pos_tag_name}? Start your response with "Yes" or "No", followed by an explanation. If yes, show me sentences where the exact word "{spanish_word}" is used in this form.'
    messages = [
        {
            "role": "system",
            "content": system_prompt,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]
    response = openai.chat.completions.create(
        model="gpt-4-turbo",
        messages=messages,
        temperature=0,
        max_tokens=512,
    )
    response_text = response.choices[0].message.content

    if response_text.lower().startswith("yes"):
        # process the full response
        doc = nlp(response_text)

        # get all instances of the spanish word with the correct POS tag
        lemmas = []
        for token in doc:
            if token.text == spanish_word and token.pos_ == pos_tag:
                lemmas.append(token.lemma_)
        if len(lemmas) == 0:
            return "No examples found"
        if len(set(lemmas)) != 1:
            return "Multiple lemmatisations found"
        return lemmas[0]
    else:
        return "ChatGPT doesn't think this is a valid POS tag"


def correct_wrong_pos(data: pd.DataFrame) -> pd.DataFrame:
    print("Correcting wrong POS")
    wrong_pos = data[data["Lemma"] == "Wrong POS"]

    threadpool_results = {}
    with ThreadPoolExecutor(max_workers=50) as executor:
        for index, row in wrong_pos.iterrows():
            spanish_word = row["Spanish"]
            pos_tag = row["POS Tag"]
            threadpool_results[
                executor.submit(correct_wrong_pos_word_lemma, spanish_word, pos_tag)
            ] = index

    wrong_pos_openai_lemmas = []
    for future in threadpool_results:
        index = threadpool_results[future]
        try:
            lemma = future.result()
        except Exception as e:
            print(f"An error occurred: {e}")
        else:
            wrong_pos_openai_lemmas.append((index, lemma))

    for index, lemma in wrong_pos_openai_lemmas:
        data.at[index, "Lemma"] = lemma

    return data


def main():
    data = read_csv(RAW_DATA_PATH)
    data = clean_data(data)
    data = add_pos_tag_column(data)
    data = add_lemma_column(data)

    # we have 10 unique POS tags in our dataset
    unique_pos_tags = data["POS Tag"].unique()
    print(f"Unique POS tags: {unique_pos_tags}")

    # get the count of each POS tag
    pos_tag_counts = data["POS Tag"].value_counts()
    print(pos_tag_counts)

    # how many words have too many tokens or wrong POS
    too_many_tokens = data[data["Lemma"] == "Too many tokens"]
    wrong_pos = data[data["Lemma"] == "Wrong POS"]
    print(f"Too many tokens: {len(too_many_tokens)}")
    print(f"Wrong POS: {len(wrong_pos)}")

    # correct the wrong POS rows using ✨ LLMs ✨
    data = correct_wrong_pos(data)

    # get the count of each POS tag after correcting wrong POS
    wrong_pos_new = data[data["Lemma"] == "Wrong POS"]
    print(f"Wrong POS old: {len(wrong_pos)}")
    print(f"Wrong POS new: {len(wrong_pos_new)}")

    # how many valid vs invalid lemmas
    data["Lemma Valid"] = data["Lemma"].apply(
        lambda x: x
        not in [
            "Too many tokens",
            "Wrong POS",
            "No examples found",
            "Multiple lemmatisations found",
            "ChatGPT doesn't think this is a valid POS tag",
            "",
        ]
    )
    print(f"Lemma valid: {data['Lemma Valid'].sum()}")
    print(f"Lemma invalid: {len(data) - data['Lemma Valid'].sum()}")

    # save the cleaned data
    data_new_columns = pd.DataFrame(
        {
            "spanish": data["Spanish"],
            "english": data["English"],
            "POS": data["POS Tag"],
            "lemma": data["Lemma"],
            "lemma_valid": data["Lemma Valid"],
        }
    )
    data_new_columns.to_csv(CLEAN_DATA_PATH, index=False)

    # get the count of invalid lemmas by POS tag
    invalid_lemmas = data[~data["Lemma Valid"]]
    print(invalid_lemmas["POS Tag"].value_counts())


if __name__ == "__main__":
    main()
