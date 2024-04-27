import os
from enum import Enum

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from modal import App, Cls, Image, Secret, asgi_app
from pydantic import BaseModel

from modal_api.utils import APP_PREFIX, ENVIRONMENT


# initialize the FastAPI app (with Bearer token authentication)
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


# ping
class PingResponse(BaseModel):
    message: str
    environment: str = ENVIRONMENT
    prefix: str = APP_PREFIX


@web_app.get("/", response_model=PingResponse)
async def ping():
    return {"message": "success"}


# spacy processing
spacy_model = Cls.lookup(
    f"{APP_PREFIX}-spacy-es-cpu", "Model", environment_name=ENVIRONMENT
)
spacy_model = Cls.lookup(
    f"{APP_PREFIX}-spacy-es-cpu", "Model", environment_name=ENVIRONMENT
)


class PosTag(str, Enum):
    ADJ = "ADJ"
    ADP = "ADP"
    PUNCT = "PUNCT"
    ADV = "ADV"
    AUX = "AUX"
    SYM = "SYM"
    INTJ = "INTJ"
    CCONJ = "CCONJ"
    X = "X"
    NOUN = "NOUN"
    DET = "DET"
    PROPN = "PROPN"
    NUM = "NUM"
    VERB = "VERB"
    PART = "PART"
    PRON = "PRON"
    SCONJ = "SCONJ"


class DepTag(str, Enum):
    ROOT = "ROOT"
    ACL = "acl"
    ADVCL = "advcl"
    ADVMOD = "advmod"
    AMOD = "amod"
    APPOS = "appos"
    AUX = "aux"
    CASE = "case"
    CC = "cc"
    CCOMP = "ccomp"
    COMPOUND = "compound"
    CONJ = "conj"
    COP = "cop"
    CSUBJ = "csubj"
    DEP = "dep"
    DET = "det"
    EXPL = "expl"
    FIXED = "fixed"
    FLAT = "flat"
    IOBJ = "iobj"
    MARK = "mark"
    NMOD = "nmod"
    NSUBJ = "nsubj"
    NUMMOD = "nummod"
    OBJ = "obj"
    OBL = "obl"
    PARATAXIS = "parataxis"
    PUNCT = "punct"
    XCOMP = "xcomp"


class SpacyToken(BaseModel):
    text: str
    pos: PosTag
    dep: DepTag
    lemma: str
    is_sent_start: bool


class SpacyProcessResponse(BaseModel):
    data: list[SpacyToken]


@web_app.get("/process", response_model=SpacyProcessResponse)
async def process(text: str):
    return {"data": spacy_model.process.remote(text)}


# chat
class AvailableModels(str, Enum):
    gpt_3_5_turbo = "gpt-3.5-turbo"


class Role(str, Enum):
    system = "system"
    user = "user"
    assistant = "assistant"


class Message(BaseModel):
    role: Role
    content: str


class ChatStreamRequest(BaseModel):
    messages: list[Message]
    model: AvailableModels


@web_app.post("/chat/stream", response_class=StreamingResponse)
async def chat_stream(request: ChatStreamRequest):
    from litellm import completion  # todo: see if this is slowing things down

    def stream():
        response = completion(
            model=request.model, messages=request.messages, stream=True
        )
        for part in response:
            yield part.choices[0].delta.content or ""

    return StreamingResponse(stream(), media_type="text/event-stream")


# register the app
app = App()

image = (
    Image.debian_slim(python_version="3.12")
    .pip_install("litellm")
    .env({"MODAL_ENVIRONMENT": ENVIRONMENT, "MODAL_APP_PREFIX": APP_PREFIX})
)


@app.function(
    image=image,
    secrets=[
        Secret.from_name("router-auth-token"),
        Secret.from_name("openai-api-key"),
    ],
    enable_memory_snapshot=True,
    concurrency_limit=1,
)
@asgi_app()
def fastapi_app():
    return web_app
