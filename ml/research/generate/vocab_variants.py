import json
import os
import pickle
from concurrent.futures import ThreadPoolExecutor
from typing import Iterable

import instructor
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from tqdm import tqdm

# load openai client
load_dotenv()
openai = instructor.patch(OpenAI())


MODEL = "gpt-3.5-turbo"
VOCAB_FILE = "ml/research/data/vocab/spanish-5000-clean-auto.csv"
OUTPUT_FILE = "ml/research/data/vocab/vocab_variants.pickle"
JSON_OUTPUT_FILE = "ml/research/data/vocab/vocab_variants.json"
MAX_WORKERS = 5


def load_vocab(file: str) -> pd.DataFrame:
    return pd.read_csv(file)


def get_sample_definition(word_pos: tuple[str, str, str]) -> str | None:
    word, _, pos = word_pos
    messages = [
        {
            "role": "user",
            "content": f"What is the meaning of {word} when used as a ${pos}? Give me a brief description / definition.",
        }
    ]
    try:
        response = openai.chat.completions.create(
            model=MODEL, messages=messages, max_tokens=512
        )
        return response.choices[0].message.content
    except Exception as e:
        print(e)
        return None


def get_definitions(words_pos: list[tuple[str, str, str]]) -> list[str | None]:
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        results = list(
            tqdm(
                executor.map(get_sample_definition, words_pos),
                total=len(words_pos),
                desc="Getting definitions...",
            )
        )
    return results


class Lesson(BaseModel):
    lesson: str


def get_sample_lessons(word_pos: tuple[str, str, str]) -> list[Lesson] | None:
    english, spanish, pos = word_pos
    system_prompt = """You are a high school spanish teacher preparing lessons for you students. Your lesson will focus on teaching a single word together with an overarching topic. 

    You will be shown a word and must return 5 possible lessons that you could teach that incorperate the word. The lessons can either focus directly on the word, or use it. Write your lessons in short, succinct sentences (full grammar isn't required).

    For each lesson, give a short 2 sentence description of the lesson, followed by 5 other related words that you might want to include. Give your answer as a JSON list of objects with a single "lesson" key."""
    one_shot_example_response = """[
        {
            "lesson": "Eating Out: In this lesson, students will learn to navigate the Spanish dining scene effectively. We will cover essential food-related phrases and dialogues for ordering meals in a restaurant, with a focus on polite requests and handling dietary restrictions. Students will practice using formal commands as they simulate ordering scenarios. Culture-wise, we'll explore typical meals and dining etiquette across Spanish-speaking countries, including practices like tipping and meal times. By role-playing restaurant interactions and interpreting Spanish menus, students will gain the confidence to handle eating out in a Spanish-speaking environment."
        },
        {
            "lesson": "Housing and Home: This lesson delves into vocabulary associated with the home and extends into hosting and entertaining guests. Students will learn terms for various rooms and furniture and engage in practical applications by planning a gathering at home. This includes discussing what refreshments to offer and how to arrange rooms. The lesson will incorporate reflexive verbs to describe daily routines and cultural insights into home life and hospitality customs in different Spanish-speaking cultures. By the end, students should be able to describe their living spaces and discuss typical household activities confidently."
        },
        {
            "lesson": "Education and Work Vocabulary: Targeting the academic and professional environments, this lesson introduces vocabulary relevant to university life and the workplace. Students will discuss academic disciplines, office essentials, and typical workday scenarios, including break-time habits such as grabbing a coffee or a quick snack. Utilizing the future tense, students will talk about their career aspirations and academic plans. Cultural discussion will highlight the differences in work and education systems across Spanish-speaking countries, enhancing students' understanding and ability to adapt to different professional and academic settings."
        },
        {
            "lesson": "Cultural Differences and Etiquette: This lesson focuses on understanding and navigating the rich tapestry of cultural norms and etiquettes across Spanish-speaking countries. Students will learn about common greetings, expected behaviors at social gatherings, and dining customs. The use of the subjunctive mood will help express desires and social expectations. Through simulated cultural exchange activities, students will experience firsthand how to react and interact in various social environments, providing a deeper insight into the culturally appropriate practices during meals, familial interactions, and other social settings."
        },
        {
            "lesson": "Sports and Fitness: Focusing on sports and maintaining health, this lesson introduces terms and discussions related to physical activities and fitness, including necessary equipment and popular sports. Students will learn about the importance of hydration and suitable drinks to maintain energy levels during exercises. The lesson also covers the imperative mood for giving fitness advice. We will explore how different Spanish-speaking countries perceive sports and fitness, enabling students to discuss and share exercise routines and health tips effectively. This practical approach will equip students with the language skills to navigate discussions about health and fitness in a Spanish context."
        }
    ]"""
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": "drink: bebida used as a noun"},
        {"role": "system", "content": one_shot_example_response},
        {"role": "user", "content": f"{english}: {spanish} used as a {pos}"},
        {
            "role": "user",
            "content": "Remember, I want exactly 5 lessons for {english} used as a {pos}, in the correct JSON format. Not 1, not 2, but EXACTLY FIVE (5) LESSONS.",
        },
    ]
    try:
        response = openai.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=4096,
            response_model=Iterable[Lesson],
        )
        return response
    except Exception as e:
        print(e)
        return None


def get_lessons(words_pos: list[tuple[str, str, str]]) -> list[list[Lesson] | None]:
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        results = list(
            tqdm(
                executor.map(get_sample_lessons, words_pos),
                total=len(words_pos),
                desc="Getting lessons...",
            )
        )
    return results


def main():
    # load the existing output (if any)
    output = {}
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "rb") as f:
            output = pickle.load(f)

    # load the vocab
    vocab = load_vocab(VOCAB_FILE)

    # filter by VERB, NOUN, ADJ POS only
    verbs = vocab[vocab["POS"] == "VERB"]
    nouns = vocab[vocab["POS"] == "NOUN"]
    adjs = vocab[vocab["POS"] == "ADJ"]
    vocab = pd.concat([verbs, nouns, adjs])
    inputs = list(
        zip(vocab["english"].values, vocab["spanish"].values, vocab["POS"].values)
    )

    # get all definitions
    definitions_inputs = [
        vocab_input
        for vocab_input in inputs
        if vocab_input not in output or "english_description" not in output[vocab_input]
    ]
    new_definitions = get_definitions(definitions_inputs)
    for vocab_input, definition in zip(definitions_inputs, new_definitions):
        if definition is None:
            print(f"Failed to get definition for {vocab_input}")
            continue
        if vocab_input not in output:
            output[vocab_input] = {}
        output[vocab_input]["english_description"] = definition

    # save the output
    with open(OUTPUT_FILE, "wb") as f:
        pickle.dump(output, f, protocol=pickle.HIGHEST_PROTOCOL)

    # get all lessons
    lessons_inputs = [
        vocab_input
        for vocab_input in inputs
        if vocab_input not in output or "lessons" not in output[vocab_input]
    ]
    new_lessons = get_lessons(lessons_inputs)

    for vocab_input, lessons in zip(lessons_inputs, new_lessons):
        if lessons is None or len(lessons) != 5:
            print(f"Failed to get lessons for {vocab_input}")
            continue
        if vocab_input not in output:
            output[vocab_input] = {}
        output[vocab_input]["lessons"] = [lesson.lesson for lesson in lessons]

    # save the output
    with open(OUTPUT_FILE, "wb") as f:
        pickle.dump(output, f, protocol=pickle.HIGHEST_PROTOCOL)

    # save json output
    with open(JSON_OUTPUT_FILE, "w") as f:
        json_output = []
        for vocab_input in inputs:
            if vocab_input not in output:
                continue
            json_output.append(
                {
                    "english": vocab_input[0],
                    "spanish": vocab_input[1],
                    "pos": vocab_input[2],
                    "english_description": output[vocab_input].get(
                        "english_description"
                    ),
                    "lessons": output[vocab_input].get("lessons"),
                }
            )
        f.write(json.dumps(json_output, indent=4, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
