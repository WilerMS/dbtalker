from datetime import datetime

from pydantic import BaseModel


class ConversationRecord(BaseModel):
    id: str
    database_id: str
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CreateConversationInput(BaseModel):
    database_id: str
    title: str
