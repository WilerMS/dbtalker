from datetime import datetime
from typing import Literal, Union

from pydantic import BaseModel

from .widgets import (
    BarData,
    CodeData,
    KpiData,
    LineData,
    QuestionData,
    SchemaData,
    TableData,
    TextData,
)

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


class BotBaseMessage(BaseModel):
    id: str
    role: MessageRole
    status: Literal["complete"] = "complete"
    type: MessageType
    timestamp: datetime


class TextMessage(BotBaseMessage):
    type: Literal["text"] = "text"
    role: Literal["bot"] = "bot"
    data: TextData


class SchemaMessage(BotBaseMessage):
    type: Literal["schema"] = "schema"
    role: Literal["bot"] = "bot"
    data: SchemaData


class KPIMessage(BotBaseMessage):
    type: Literal["kpi"] = "kpi"
    role: Literal["bot"] = "bot"
    data: KpiData


class BarMessage(BotBaseMessage):
    type: Literal["bar"] = "bar"
    role: Literal["bot"] = "bot"
    data: BarData


class LineMessage(BotBaseMessage):
    type: Literal["line"] = "line"
    role: Literal["bot"] = "bot"
    data: LineData


class TableMessage(BotBaseMessage):
    type: Literal["table"] = "table"
    role: Literal["bot"] = "bot"
    data: TableData


class CodeMessage(BotBaseMessage):
    type: Literal["code"] = "code"
    role: Literal["bot"] = "bot"
    data: CodeData


class QuestionMessage(BotBaseMessage):
    type: Literal["question"] = "question"
    role: Literal["bot"] = "bot"
    data: QuestionData


BotMessage = Union[
    TextMessage,
    SchemaMessage,
    KPIMessage,
    BarMessage,
    LineMessage,
    TableMessage,
    CodeMessage,
    QuestionMessage,
]


# * UserMessage is always a text message
class UserMessage(BaseModel):
    id: str
    role: Literal["user"] = "user"
    type: Literal["text"] = "text"
    status: Literal["complete"] = "complete"
    data: TextData
    timestamp: datetime


class PendingMessage(BaseModel):
    id: str
    status: Literal["pending"] = "pending"
    role: Literal["bot"] = "bot"
    type: MessageType


ChatMessage = Union[UserMessage, BotMessage]

# Superset of all available messages in a conversation
BOT_MESSAGE_CLASSES = {
    "text": TextMessage,
    "kpi": KPIMessage,
    "table": TableMessage,
    "bar": BarMessage,
    "line": LineMessage,
    "code": CodeMessage,
    "schema": SchemaMessage,
    "question": QuestionMessage,
}


# --- Input schema for the chat endpoint ---
class ChatRequestBody(BaseModel):
    message: UserMessage
    database_id: str
    conversation_id: str
