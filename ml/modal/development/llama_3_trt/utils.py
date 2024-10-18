from litellm.utils import Message


def format_llama_3_messages(messages: list[Message]) -> str:
    prompt = "<|begin_of_text|>"
    for message in messages:
        prompt += f"<|start_header_id|>{message.role}<|end_header_id|>\n\n{message.content}<|eot_id|>"
    prompt += "\n<|start_header_id|>assistant<|end_header_id|>"
    return prompt


def main():
    test_messages = [
        Message(content="You are an LLM", role="system"),
        Message(content="I am a human being", role="user"),
        Message(content="I am an LLM", role="assistant"),
        Message(content="My name is Patrick", role="user"),
    ]
    print(format_llama_3_messages(test_messages))


if __name__ == "__main__":
    main()
