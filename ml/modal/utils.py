import logging
import os
from datetime import datetime

from dotenv import load_dotenv
from pydantic import BaseModel, Field

# logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# constants
load_dotenv()
ENVIRONMENT = os.environ.get("MODAL_ENVIRONMENT")
APP_PREFIX = os.environ.get("MODAL_APP_PREFIX")
MODAL_FOLDER = "ml/modal"
APPS_FOLDER = f"{MODAL_FOLDER}/production"
ROUTER_FILENAME = f"{APPS_FOLDER}/router.py"


# to validate modal CLI response
class ModalApp(BaseModel):
    id: str = Field(..., alias="App ID")
    name: str = Field(..., alias="Name")
    state: str = Field(..., alias="State")
    creation_time: datetime = Field(..., alias="Creation time")
    stop_time: str | None = Field(None, alias="Stop time")
