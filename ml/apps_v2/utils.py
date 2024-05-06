import os
import typing

import modal
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from ml.utils import APP_PREFIX, ENVIRONMENT


def create_app(auth: bool = True, **kwargs):
    async def verify_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
        if token.credentials != os.environ["ROUTER_AUTH_TOKEN"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )

    web_app = FastAPI(dependencies=[Depends(verify_token)] if auth else [], **kwargs)
    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class PingResponse(BaseModel):
        message: str
        environment: str = ENVIRONMENT
        prefix: str = APP_PREFIX

    @web_app.get("/", response_model=PingResponse)
    async def ping():
        return {"message": "success"}

    return web_app


def get_web_image():
    return (
        modal.Image.debian_slim(python_version="3.12")
        .pip_install("python-dotenv", "litellm")
        .env({"MODAL_ENVIRONMENT": ENVIRONMENT, "MODAL_APP_PREFIX": APP_PREFIX})
    )


Scope = typing.MutableMapping[str, typing.Any]
Message = typing.MutableMapping[str, typing.Any]
Receive = typing.Callable[[], typing.Awaitable[Message]]
Send = typing.Callable[[Message], typing.Awaitable[None]]
RequestTuple = typing.Tuple[Scope, Receive, Send]


def add_batcher_middleware(
    app: FastAPI,
    processor: typing.Callable[[dict[int, RequestTuple], int], dict[int, RequestTuple]],
    batch_max_size: int = 5,
    batch_max_seconds: int = 0.5,
):
    pass
