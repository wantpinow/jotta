from fastapi import FastAPI
from litellm.utils import TextCompletionResponse

web_app = FastAPI()


@web_app.get("/completions", response_model=TextCompletionResponse)
async def ping():
    return TextCompletionResponse.model_validate(
        {
            "object": "chat.completion",
            "choices": [
                {
                    "finish_reason": "stop",
                    "index": 0,
                    "message": {
                        "content": "The sky, a canvas of blue,\nA work of art, pure and true,\nA",
                        "role": "assistant",
                    },
                }
            ],
            "id": "chatcmpl-7fbd6077-de10-4cb4-a8a4-3ef11a98b7c8",
            "created": 1699290237,
            "model": "togethercomputer/llama-2-70b-chat",
            "usage": {"completion_tokens": 18, "prompt_tokens": 14, "total_tokens": 32},
        }
    )
