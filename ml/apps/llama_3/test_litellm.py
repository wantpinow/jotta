import os

from litellm import completion

## set ENV variables
os.environ["OPENAI_API_KEY"] = "anything"  # key is not used for proxy

messages = [{"content": "Hello, how are you?", "role": "user"}]

response = completion(
    model="command-nightly",
    messages=[{"content": "Hello, how are you?", "role": "user"}],
    api_base="https://openai-proxy.berriai.repl.co",
    custom_llm_provider="openai",  # litellm will use the openai.ChatCompletion to make the request
)
print(response)
