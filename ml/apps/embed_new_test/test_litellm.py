import os

from litellm import completion

## set ENV variables
os.environ["OPENAI_API_KEY"] = "anything"  # key is not used for proxy

messages = [
    {"content": "You are an LLM", "role": "system"},
    {"content": "Hello, how are you?", "role": "user"},
    {"content": "Good hbu", "role": "assistant"},
    {"content": "Good!", "role": "user"},
]

response = completion(
    model="custom/foobar",
    messages=messages,
    api_base="https://wantpinow-jotta-dev--test-litellm-fastapi-app.modal.run/",
    # api_base="https://wantpinow-jotta-dev--test-litellm-flask-app.modal.run/",
    custom_llm_provider="openai",  # litellm will use the openai.ChatCompletion to make the request
)
print(response)

# from litellm.utils import TextCompletionResponse

# print(
#     TextCompletionResponse.model_validate(
#         {
#             "object": "chat.completion",
#             "choices": [
#                 {
#                     "finish_reason": "stop",
#                     "index": 0,
#                     "message": {
#                         "content": "The sky, a canvas of blue,\nA work of art, pure and true,\nA",
#                         "role": "assistant",
#                     },
#                 }
#             ],
#             "id": "chatcmpl-7fbd6077-de10-4cb4-a8a4-3ef11a98b7c8",
#             "created": 1699290237,
#             "model": "togethercomputer/llama-2-70b-chat",
#             "usage": {"completion_tokens": 18, "prompt_tokens": 14, "total_tokens": 32},
#         }
#     )
# )
