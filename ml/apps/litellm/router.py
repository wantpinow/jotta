from fastapi import FastAPI
from litellm.utils import TextCompletionResponse
from modal import App, Image, asgi_app
from pydantic import BaseModel

from ml.utils import APP_PREFIX, ENVIRONMENT


class Message(BaseModel):
    content: str
    role: str


class ChatCompletionRequest(BaseModel):
    messages: list[Message]
    model: str


image = (
    Image.debian_slim(python_version="3.12")
    .pip_install("litellm")
    .env({"MODAL_ENVIRONMENT": ENVIRONMENT, "MODAL_APP_PREFIX": APP_PREFIX})
)


web_app = FastAPI()


@web_app.post("/chat/completions", response_model=TextCompletionResponse)
async def ping(request: ChatCompletionRequest):
    print(request)
    return {
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


# register the app
app = App("test-litellm")


@app.function(
    image=image,
    enable_memory_snapshot=True,
    concurrency_limit=1,
)
@asgi_app()
def fastapi_app():
    return web_app


# from modal import App, Image, wsgi_app

# app = App("test-litellm")
# image = Image.debian_slim().pip_install("flask")

# with image.imports():
#     from flask import Flask, request


# @app.function(image=image)
# @wsgi_app()
# def flask_app():
#     web_app = Flask(__name__)

#     @web_app.get("/")
#     def home():
#         return "Hello Flask World!"

#     @web_app.post("/chat/completions")
#     def chat_completions():
#         print(request.json)
#         return {
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

#     return web_app
