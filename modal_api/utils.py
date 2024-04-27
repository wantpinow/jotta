import logging
import os
from datetime import datetime

from dotenv import load_dotenv
from pydantic import BaseModel, Field

# logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# load modal environment and prefix
load_dotenv()


if "MODAL_ENVIRONMENT" not in os.environ:
    raise ValueError("MODAL_ENVIRONMENT not set")

if "MODAL_APP_PREFIX" not in os.environ:
    raise ValueError("MODAL_APP_PREFIX not set")

ENVIRONMENT = os.environ["MODAL_ENVIRONMENT"]
APP_PREFIX = os.environ["MODAL_APP_PREFIX"]

# other constants
MODAL_FOLDER = "modal_api"
APPS_FOLDER = f"{MODAL_FOLDER}/apps"
ROUTER_FILENAME = f"{MODAL_FOLDER}/router.py"


# to validate modal CLI response
class ModalApp(BaseModel):
    id: str = Field(..., alias="App ID")
    name: str = Field(..., alias="Name")
    state: str = Field(..., alias="State")
    creation_time: datetime = Field(..., alias="Creation time")
    stop_time: str | None = Field(None, alias="Stop time")
