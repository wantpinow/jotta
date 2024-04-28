import os

import pandas as pd
import spacy
from dotenv import load_dotenv
from openai import OpenAI
from youtube_transcript_api import YouTubeTranscriptApi

# load openai client
load_dotenv()
openai = OpenAI()


# load the spacy model (and download it if it doesn't exist)
SPACY_MODEL_NAME = "es_core_news_md"
try:
    nlp = spacy.load(SPACY_MODEL_NAME)
except OSError:
    import spacy.cli

    spacy.cli.download(SPACY_MODEL_NAME)
    nlp = spacy.load(SPACY_MODEL_NAME)


# fetch youtube data
def download_transcript(
    video_id: str, cache_folder: str = "ml/research/data/youtube"
) -> str:
    filename = f"{cache_folder}/{video_id}.txt"
    if os.path.exists(filename):
        with open(filename, "r") as f:
            return f.read()
    res = YouTubeTranscriptApi.get_transcript(video_id, languages=["es"])
    transcript = " ".join([x["text"] for x in res]).strip().replace("\n", " ")
    with open(filename, "w") as f:
        f.write(transcript)
    return transcript


def download_transcripts(video_ids: list[str]) -> list[str]:
    return [download_transcript(video_id) for video_id in video_ids]


# fetch news data
def get_news_csv(filename: str, sample_size: int) -> list[str]:
    data = pd.read_csv(filename)
    return data["news"][:sample_size].tolist()


# write stories using chatgpt
def write_chatgpt_story(
    topic: str, cache_folder: str = "ml/research/data/chatgpt_stories"
):
    filename = f"{cache_folder}/{topic.replace(" ", "_")}.txt"
    if os.path.exists(filename):
        with open(filename, "r") as f:
            return f.read()
    messages = [
        {
            "role": "system",
            "content": "Eres un profesor de español de clase mundial que prepara un plan de lección para un grupo de estudiantes de 15 años. Se te dará un tema y deberás escribir una historia ficticia que atraiga a los estudiantes y les ayude a aprender el tema. La historia no debe tener más de 200 palabras.",
        },
        {"role": "user", "content": f"Escribe una historia sobre {topic}."},
    ]
    response = openai.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
    with open(filename, "w") as f:
        f.write(response.choices[0].message.content)
    return response.choices[0].message.content


def get_chatgpt_data(topics: list[str]) -> list[str]:
    return [write_chatgpt_story(topic) for topic in topics]


# analyse data with different vocabs
def get_dataset_lemma_counts(data: list[str], allowed_pos_tags: list[str]) -> dict:
    dataset_lemma_counts = []
    total_valid_tokens = 0
    for sample in data:
        sample_lemma_counts = {}
        doc = nlp(sample)
        for token in doc:
            if token.pos_ not in allowed_pos_tags:
                continue
            total_valid_tokens += 1
            lemma = token.lemma_
            if lemma not in sample_lemma_counts:
                sample_lemma_counts[lemma] = 0
            sample_lemma_counts[lemma] += 1

        for lemma in sample_lemma_counts:
            sample_lemma_counts[lemma] /= total_valid_tokens

        dataset_lemma_counts.append(sample_lemma_counts)

    # calculate the average lemma counts
    avg_lemma_counts = {}
    for sample_lemma_counts in dataset_lemma_counts:
        for lemma in sample_lemma_counts:
            if lemma not in avg_lemma_counts:
                avg_lemma_counts[lemma] = 0
            avg_lemma_counts[lemma] += sample_lemma_counts[lemma]

    for lemma in avg_lemma_counts:
        avg_lemma_counts[lemma] /= len(dataset_lemma_counts)

    return avg_lemma_counts


def main():
    # fetch data to analyse
    print("Fetching data...")
    video_ids = ["F4x5JqN9Ep4", "Wa8BtQKa2hY", "Pv0iVoSZzN8"]
    youtube_data = download_transcripts(video_ids)
    news_filename = "ml/research/data/news/spanish-news-classification.csv"
    news_sample_size = 100
    news_data = get_news_csv(news_filename, sample_size=news_sample_size)
    topics = ["el medio ambiente", "la tecnología", "la historia"]
    chatgpt_data = get_chatgpt_data(topics)
    print("Data fetched successfully.")

    # load the vocabulary
    allowed_pos_tags = ["NOUN", "VERB", "ADJ"]
    vocab_filename = "ml/research/data/vocab/spanish-5000-clean-auto.csv"
    vocab = pd.read_csv(vocab_filename)
    vocab = vocab[vocab["POS"].isin(allowed_pos_tags) & vocab["lemma_valid"]]

    # analyse the data
    print("Analysing data...")
    youtube_lemma_counts = get_dataset_lemma_counts(youtube_data, allowed_pos_tags)
    news_lemma_counts = get_dataset_lemma_counts(news_data, allowed_pos_tags)
    chatgpt_lemma_counts = get_dataset_lemma_counts(chatgpt_data, allowed_pos_tags)

    # what are the top n words in each dataset that are not in the vocab?
    vocab_lemmas = set(vocab["lemma"].tolist())
    top_n = 30
    for dataset_name, dataset_lemma_counts in [
        ("youtube", youtube_lemma_counts),
        ("news", news_lemma_counts),
        ("chatgpt", chatgpt_lemma_counts),
    ]:
        print(f"Top {top_n} words in {dataset_name} that are not in the vocab:")
        dataset_lemmas = set(dataset_lemma_counts.keys())
        unknown_lemmas = dataset_lemmas - vocab_lemmas
        unknown_lemmas = sorted(unknown_lemmas, key=lambda x: -dataset_lemma_counts[x])
        for i, lemma in enumerate(unknown_lemmas[:top_n]):
            print(f"{i+1}. {lemma} ({dataset_lemma_counts[lemma]:.4f})")
        print()


if __name__ == "__main__":
    main()
