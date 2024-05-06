from litellm import completion

# import os

## set ENV variables
# os.environ["OPENAI_API_KEY"] = "anything" #key is not used for proxy

messages = [
    {"content": "You are an LLM", "role": "system"},
    {"content": "Hello, how are you?", "role": "user"},
    {"content": "Good hbu", "role": "assistant"},
    {"content": "Good!", "role": "user"},
]

response = completion(
    model="command-nightly",
    messages=messages,
    api_base="https://wantpinow-jotta-dev--embed-new-test-embed-web-dev.modal.run",
    custom_llm_provider="openai",  # litellm will use the openai.ChatCompletion to make the request
)
print(response)
