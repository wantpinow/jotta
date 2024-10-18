from typing import List

import dspy
from pydantic import BaseModel


class State(BaseModel):
    name: str
    abbreviation: str
    capital: str


class States(BaseModel):
    states: List[State]


class ExampleSignature(dspy.Signature):
    question = dspy.InputField()
    states = dspy.OutputField(
        desc=f"The answer written as a single JSON object using the schema {States.schema()}"
    )


def main():
    lm = dspy.OpenAI(model="gpt-3.5-turbo-instruct", max_tokens=400)
    dspy.settings.configure(lm=lm, trace=["Test"])

    program = dspy.Predict(ExampleSignature)
    res = program(question="What are the three largest states in the US?")

    try:
        print(res.states)
        exit()
        states = States.parse_raw(res.states)
    except ValueError as e:
        dspy.Assert(False, e)

    print(states.states)
    lm.inspect_history(n=3)


if __name__ == "__main__":
    main()
