import concurrent.futures
from time import time

from openai import OpenAI

messages = [{"role": "user", "content": "Hello, I'm a user."}]

client = OpenAI(api_key="super-secret-token")
client.base_url = (
    "https://wantpinow-jotta-dev--vllm-openai-compatible-serve.modal.run/v1"
)


def get_response(messages) -> dict:
    print(messages[0]["content"])
    res = client.chat.completions.create(
        model="/models/meta-llama/Meta-Llama-3-8B-Instruct", messages=messages
    )
    print(f"Completed: {messages[0]['content']}")
    return res.choices[0].message.content


def process_requests(n: int):
    start = time()
    longest_response = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=n) as executor:
        message_sets = [
            [{"role": "user", "content": f"Hello, I'm a user. {i}"}] for i in range(n)
        ]

        future_to_messages = {
            executor.submit(get_response, messages): messages
            for messages in message_sets
        }
        for future in concurrent.futures.as_completed(future_to_messages):
            messages = future_to_messages[future]
            try:
                response = future.result()
                longest_response = max(longest_response, len(response))
            except Exception:
                print("failed")
    end_time = time()
    duration = end_time - start
    print(f"Time taken to process {n} requests: {duration:.2f}s")
    print(f"Longest response: {longest_response}")
    print(f"Tokens Per Second (longest response): {longest_response / duration}")
    print()


process_requests(1)
process_requests(10)
process_requests(50)
