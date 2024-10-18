import json

from openai import OpenAI
from pydantic import BaseModel

json_template = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
    },
    "required": ["answer"],
}

messages = [
    {
        "role": "system",
        "content": f"You must respond with JSON according to the following schema. DO NOT add any unncessary spaces or tabs.\n```json\n{json.dumps(json_template, indent=2)}\n```",
    },
    {"role": "user", "content": "What the capital of USA?"},
    # {
    #     "role": "user",
    #     "content": 'Respond exactly like this: {"answer": "13.8 billion years"}',
    # },
]

client = OpenAI(api_key="super-secret-token")
client.base_url = (
    "https://wantpinow-jotta-dev--vllm-openai-compatible-serve.modal.run/v1"
)


class Response(BaseModel):
    answer: str


# this is super slow?
completion = client.chat.completions.create(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    messages=messages,
    response_format={
        "type": "json_object",
        "schema": Response.model_json_schema(),
    },
    extra_body={
        "guided_json": json_template,
        # "guided_decoding_backend": "lm-format-enforcer",
    },
    stream=False,
)
print(completion.choices[0].message.content)


# # this is super fast?
# completion = client.chat.completions.create(
#     model="/models/meta-llama/Meta-Llama-3-8B-Instruct",
#     messages=messages,
#     # response_format={"type": "json_object"},
#     extra_body={
#         "guided_json": json_template,
#         "guided_decoding_backend": "lm-format-enforcer",
#     },
#     stream=True,
# )
# for message in completion:
#     print(message.choices[0].delta.content)
