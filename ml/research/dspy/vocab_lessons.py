import os

import dspy
import dspy.teleprompt
from dspy import Example
from dspy.evaluate.evaluate import Evaluate
from dspy.teleprompt import MIPRO

examples = [
    {
        "english": "to walk",
        "spanish": "caminar",
        "type": "verb",
        "description": "To walk is to move forward by taking steps with your feet. It is a form of exercise and a way to get from one place to another. Walking is a common activity that most people do every day.",
        "lessons": [
            "Walking through town: the student will walk around town and describe what they see. They will describe different buildings, people, and modes of transportation - including walking.",
            "Last night in Seville: the student will describe their previous night in Seville. They will describe how they walked a long distance to get to a party, and how they walked back home.",
            "Marathon training: the student will describe their training for a marathon. They will describe how they combine walking and running to build up their endurance. They will also describe how they walk to cool down after a run.",
        ],
    },
    {
        "english": "state, condition, status",
        "spanish": "estado",
        "type": "noun",
        "description": "A state is a condition or status of something. It can refer to the physical condition of an object, the emotional state of a person, or the political status of a country. In some cases, states can change over time - for example, the state of a country can change from peace to war, or the emotional state of a person can change from happy to sad.",
        "lessons": [
            "State of the nation: the student will describe the current state of the nation. They will describe the political, economic, and social conditions of the country.",
            "Therapy session: the student will describe a therapy session. They will describe how the therapist helps the patient explore their emotional state and work through their feelings.",
            "Physical examination: the student will describe a physical examination. They will describe how the doctor assesses the physical state of the patient and checks for any signs of illness or injury.",
        ],
    },
    {
        "english": "book",
        "spanish": "libro",
        "type": "noun",
        "description": "A book is a written or printed work consisting of pages glued or sewn together along one side and bound in covers. Books can contain a wide variety of information, including stories, facts, and pictures. They are often used for entertainment, education, or reference.",
        "lessons": [
            "My favorite book: the student will describe their favorite book. They will describe the plot, characters, and themes of the book, and explain why it is their favorite.",
            "Library visit: the student will describe a visit to the library. They will describe how they choose a book to read, and how they find information in the library.",
            "Homework assignment: the student will describe a homework assignment. They will describe how they use a book to research a topic and write a report. They will discuss their thoughts on the assignment and how they completed it.",
        ],
    },
    {
        "english": "absolute",
        "spanish": "absoluto",
        "type": "adjective",
        "description": "Absolute means complete and total. It is used to describe something that is not limited or restricted in any way. For example, an absolute ruler has complete control over a country, and an absolute value is a number that is not negative.",
        "lessons": [
            "Absolute power: the student will describe a ruler with absolute power. They will describe how the ruler controls the country and makes decisions without any restrictions.",
            "Fierce debate: the student will describe a fierce debate. They will describe how the participants have absolute confidence in their arguments and refuse to compromise. They will use the word 'absolute' to describe the intensity of the debate.",
            "Math class: the student will describe a math class. They will describe how they learn about absolute values and how to calculate them. They will explain the concept of absolute value and how it is used in mathematics.",
        ],
    },
    {
        "english": "short, brief",
        "spanish": "corto",
        "type": "adjective",
        "description": "Short means not long in duration, distance, or height. It is used to describe something that is small in size or length. For example, a short story is a brief narrative that is not very long, and a short person is not very tall.",
        "lessons": [
            "Short story: the student will describe a short story. They will describe the plot, characters, and themes of the story, and explain why it is considered short.",
            "Describing our friends: the student will describe their friends. They will describe their friends' physical appearance, personality traits, and interests, including whether they are tall or short.",
            "Short film: the student will describe a short film. They will describe the plot, characters, and themes of the film, and explain why it is considered short.",
        ],
    },
]


# Set up the LMs
gpt_3_5_turbo = dspy.OpenAI(model="gpt-3.5-turbo", max_tokens=250, model_type="chat")
gpt_4_turbo = dspy.OpenAI(
    api_base="https://api.openai.com/v1/",
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4-turbo",
    max_tokens=1000,
    model_type="chat",
)
# llama_3 = dspy.OpenAI(
#     api_base="https://wantpinow-jotta-dev--vllm-openai-compatible-serve.modal.run/v1/",
#     api_key="super-secret-token",
#     model="meta-llama/Meta-Llama-3-8B-Instruct",
#     max_tokens=250,
#     model_type="chat",
# )


examples_dspy = [
    Example(
        english=example["english"],
        spanish=example["spanish"],
        type=example["type"],
        description=example["description"],
        # lessons=example["lessons"],
    ).with_inputs("english", "spanish", "type")
    for example in examples
]
trainset = examples_dspy[:3]
devset = examples_dspy[3:]


class GenerateDescription(dspy.Signature):
    """Generate a description of a given word provided in English and Spanish."""

    english = dspy.InputField()
    spanish = dspy.InputField()
    type = dspy.InputField()

    description = dspy.OutputField(desc="The generated description of the term.")


class GenerationPrediction(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_description = dspy.ChainOfThought(GenerateDescription)

    def forward(self, english, spanish, type):
        description = self.generate_description(
            english=english, spanish=spanish, type=type
        ).description
        return dspy.Prediction(
            english=english,
            spanish=spanish,
            type=type,
            description=description,
        )


class TypedDescriptionEvaluator(dspy.Signature):
    """Evaluate the quality of a generated description of a given word provided in English and Spanish, according to some criterion."""

    criterion: str = dspy.InputField(desc="The evaluation criterion.")
    english: str = dspy.InputField(desc="The English word.")
    spanish: str = dspy.InputField(desc="The Spanish word.")
    type: str = dspy.InputField(
        desc="The type of the word. (e.g., noun, verb, adjective)"
    )

    ground_truth_description: str = dspy.InputField(
        desc="An expert written Ground Truth Description of the term."
    )
    predicted_description: str = dspy.InputField(
        desc="The system's description of the term."
    )

    rating: float = dspy.OutputField(
        desc="An integer rating between 1 and 5. Just the integer, no text."
    )


def Metric(gold, pred, trace=None):
    alignment_criterion = (
        "How aligned is the predicted_description with the ground_truth_description?"
    )
    with dspy.context(lm=gpt_4_turbo):
        rating = dspy.TypedPredictor(TypedDescriptionEvaluator)(
            criterion=alignment_criterion,
            english=gold.english,
            spanish=gold.spanish,
            type=gold.type,
            ground_truth_description=gold.description,
            predicted_description=pred.description,
        ).rating
    return rating


evaluate = Evaluate(devset=devset, num_threads=4, display_progress=False)
uncompiled_score = evaluate(GenerationPrediction(), metric=Metric)
print(f"\n\033[91mUncompiled Generation Score: {uncompiled_score}\n")

for i in range(1, 4, 1):
    dspy.settings.configure(lm=gpt_3_5_turbo)

    teleprompter = MIPRO(
        prompt_model=gpt_4_turbo,
        task_model=gpt_3_5_turbo,
        metric=Metric,
        num_candidates=10,
        init_temperature=0.5,
    )
    kwargs = dict(num_threads=100, display_progress=True, display_table=0)
    MIPRO_compiled_RAG = teleprompter.compile(
        GenerationPrediction(),
        trainset=trainset,
        num_trials=3,
        max_bootstrapped_demos=1,
        max_labeled_demos=0,
        eval_kwargs=kwargs,
    )
    eval_score = evaluate(MIPRO_compiled_RAG, metric=Metric)
    print(f"\n\033[91mCompiled MIPRO Score at Demos = {i}: {eval_score}\n")

# # Define the signature for automatic assessments.
# class AssessDescription(dspy.Signature):
#     """Assess the quality of a description of a given word provided in English and Spanish."""

#     assessed_english = dspy.InputField()
#     assessed_spanish = dspy.InputField()
#     assessed_type = dspy.InputField()
#     assessed_description = dspy.InputField()

#     assessment_answer = dspy.OutputField(desc="Yes or No")


# def metric(gold, pred, trace=None):
#     # question, answer, tweet = gold.question, gold.answer, pred.output
#     gold_english, gold_spanish, gold_type, gold_description, pred_description = (
#         gold.english,
#         gold.spanish,
#         gold.type,
#         gold.description,
#         pred.description,
#     )

#     # Assess the quality of the generated description
#     comphrensive = (
#         "Does the assessed text provide a comprehensive description of the term?"
#     )
#     correct = f"The text should describe `{gold_english}` in `{gold_spanish}` as a `{gold_type}` according to the

#     with dspy.context(lm=gpt4T):
#         comphrensive = dspy.Predict(Assess)(
#             assessed_english=gold_english,
#             assessed_spanish=gold_spanish,
#             assessed_type=gold_type,
#             assessed_description=pred_description,
#         )
#         correct = dspy.Predict(Assess)(
#             assessed_english=gold_english,
#             assessed_spanish=gold_spanish,
#             assessed_type=gold_type,
#             assessed_description=pred_description,
#         )

#     correct, comphrensive = [
#         m.assessment_answer.lower() == "yes" for m in [correct, comphrensive]
#     ]

#     score = correct + comphrensive
#     if trace is not None:
#         return score >= 2

#     return score / 2.0


# # Set up the optimizer: we want to "bootstrap" (i.e., self-generate) 4-shot examples of our CoT program.
# config = dict(max_bootstrapped_demos=2, max_labeled_demos=2)

# # Optimize! Use the `gsm8k_metric` here. In general, the metric is going to tell the optimizer how well it's doing.
# teleprompter = dspy.teleprompt.BootstrapFewShot(metric=metric, **config)
# optimized_cot = teleprompter.compile(CoT(), trainset=examples_dspy)


# print(turbo.inspect_history(n=1))
