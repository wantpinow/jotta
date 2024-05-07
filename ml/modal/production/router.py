import os

import modal
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from ml.modal.production.spacy.models import Language, SpacyToken
from ml.modal.utils import APP_PREFIX, ENVIRONMENT

##########################################################
# setup fastapi app with Bearer token authentication
##########################################################


async def verify_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    if token.credentials != os.environ["ROUTER_AUTH_TOKEN"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )


web_app = FastAPI(dependencies=[Depends(verify_token)])
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

##########################################################
# embeddings
##########################################################
embedding_model = modal.Cls.lookup(
    f"{APP_PREFIX}-embeddings", "EmbeddingModel", environment_name=ENVIRONMENT
)


class EmbeddingRequest(BaseModel):
    texts: list[str]


class EmbeddingResponse(BaseModel):
    embeddings: list[list[float]]


@web_app.post(
    "/embeddings/embed", response_model=EmbeddingResponse, tags=["embeddings"]
)
async def embed(body: EmbeddingRequest):
    embeddings = embedding_model.embed.remote(body.texts)
    return EmbeddingResponse(embeddings=embeddings)


##########################################################
# spacy pipeline
##########################################################
spacy_model = modal.Cls.lookup(
    f"{APP_PREFIX}-spacy", "SpacyPipeline", environment_name=ENVIRONMENT
)


class SpacyProcessRequest(BaseModel):
    text: str
    language: Language


class SpacyProcessResponse(BaseModel):
    data: list[SpacyToken]


@web_app.post("/spacy/process", response_model=SpacyProcessResponse, tags=["spacy"])
async def process(
    text: str,
    language: Language,
):
    data = spacy_model.process.remote(text, language=language)
    return SpacyProcessResponse(data=data)


##########################################################
# setup and register modal app
##########################################################
image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("litellm")
    .env({"MODAL_ENVIRONMENT": ENVIRONMENT, "MODAL_APP_PREFIX": APP_PREFIX})
)
app = modal.App("router")


@app.function(
    image=image,
    secrets=[
        modal.Secret.from_name("router-auth-token"),
        modal.Secret.from_name("openai-api-key"),
    ],
    enable_memory_snapshot=True,
    concurrency_limit=1,
    allow_concurrent_inputs=128,
)
@modal.asgi_app()
def fastapi_app():
    return web_app
