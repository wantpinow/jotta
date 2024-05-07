# import os

## set ENV variables
# os.environ["OPENAI_API_KEY"] = "anything" #key is not used for proxy

from litellm import batch_completion

messages = [
    # {"content": "You are an LLM", "role": "system"},
    # {"content": "Hello, how are you?", "role": "user"},
    # {"content": "Good hbu", "role": "assistant"},
    # {"content": "Good!", "role": "user"},
    {"content": "What's your name? Give it in one word.", "role": "user"}
]


print("Sending messages to LLM")
response = batch_completion(
    model="command-nightly",
    messages=[messages, messages],
    api_base="https://wantpinow-jotta-dev--apps-v2-llama-3-fastapi-app.modal.run/",
    custom_llm_provider="openai",  # litellm will use the openai.ChatCompletion to make the request
)
print(response)
