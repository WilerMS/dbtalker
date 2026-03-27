from datetime import datetime
from typing import Literal, Union

from pydantic import BaseModel

from .widgets import MessageData, TextData

MessageRole = Literal["user", "bot"]
MessageType = Literal[
    "text",
    "schema",
    "kpi",
    "bar",
    "line",
    "table",
    "code",
    "question",
]


class PendingMessage(BaseModel):
    id: str
    role: MessageRole
    type: MessageType
    status: Literal["pending"] = "pending"
    timestamp: datetime


class CompleteMessage(BaseModel):
    id: str
    role: MessageRole
    type: MessageType
    status: Literal["complete"] = "complete"
    data: MessageData
    timestamp: datetime


class UserMessage(CompleteMessage):
    role: Literal["user"]
    type: Literal["text"]
    status: Literal["complete"] = "complete"
    data: TextData


Message = Union[PendingMessage, CompleteMessage]


class ChatRequestBody(BaseModel):
    message: UserMessage
    database_id: str
    conversation_id: str
