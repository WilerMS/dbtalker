from __future__ import annotations

from datetime import datetime
from typing import Literal, Union

from pydantic import BaseModel, Field

# ============================================================================
# Database Types
# ============================================================================

DatabaseEngine = Literal["postgresql", "mongodb", "sqlite"]


class DatabaseRecord(BaseModel):
    """Represents a registered database connection."""

    id: str
    name: str
    engine: DatabaseEngine
    icon: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime


class CreateDatabaseInput(BaseModel):
    """Request body for creating a new database."""

    name: str
    engine: DatabaseEngine
    description: str | None = None


class UpdateDatabaseInput(BaseModel):
    """Request body for updating a database."""

    name: str | None = None
    engine: DatabaseEngine | None = None
    description: str | None = None


# ============================================================================
# Conversation Types
# ============================================================================


class ConversationRecord(BaseModel):
    """Represents a conversation/chat history for a database."""

    id: str
    database_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class CreateConversationInput(BaseModel):
    """Request body for creating a new conversation."""

    title: str


# ============================================================================
# Chat Message Types (mirroring client types)
# ============================================================================

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


# --- Text Data ---
class TextData(BaseModel):
    """Plain text response data."""

    text: str


# --- Schema Data ---
class SchemaColumn(BaseModel):
    """Column definition in a database schema."""

    name: str
    type: str
    model_config = {"populate_by_name": True}
    is_primary_key: bool | None = Field(None, alias="isPrimaryKey")


class SchemaNodeData(BaseModel):
    """Data for a schema diagram node (table)."""

    label: str
    columns: list[SchemaColumn]


class SchemaNode(BaseModel):
    """A node in the schema diagram."""

    id: str
    position: dict[str, float]
    data: SchemaNodeData


class SchemaEdge(BaseModel):
    """An edge (relationship) in the schema diagram."""

    id: str
    source: str
    target: str
    label: str | None = None


class SchemaData(BaseModel):
    """Complete schema diagram data."""

    title: str
    nodes: list[SchemaNode]
    edges: list[SchemaEdge]


# --- KPI Data ---
class KpiData(BaseModel):
    """Key Performance Indicator data."""

    value: str | float | int
    label: str
    delta: str | None = None


# --- Bar Chart Data ---
class BarData(BaseModel):
    """Bar chart data."""

    labels: list[str]
    values: list[float | int]
    title: str | None = None


# --- Line Chart Data ---
class LinePoint(BaseModel):
    """A point in a line chart."""

    x: str
    y: float | int


class LineData(BaseModel):
    """Line chart data."""

    points: list[LinePoint]
    title: str | None = None


# --- Table Data ---
class TableRow(BaseModel):
    """A row in a table."""

    class Config:
        extra = "allow"  # Allow arbitrary keys for table columns

    pass


class TableData(BaseModel):
    """Table display data."""

    title: str
    columns: list[str]
    rows: list[dict[str, str | float | int]]  # Use dict directly for flexibility


# --- Code Snippet Data ---
CodeLanguage = Literal["sql", "postgresql", "mysql", "sqlite"]


class CodeData(BaseModel):
    """Code snippet widget data."""

    title: str
    language: CodeLanguage
    code: str
    description: str | None = None


# --- Question Data ---
class QuestionOption(BaseModel):
    """Selectable option for a question widget."""

    id: str
    label: str
    description: str | None = None


class QuestionData(BaseModel):
    """Question widget data where the user can choose one option."""

    title: str
    prompt: str
    options: list[QuestionOption] = Field(min_length=1, max_length=3)
    hint: str | None = None


# --- Message Data Union ---
MessageData = Union[
    TextData,
    SchemaData,
    KpiData,
    BarData,
    LineData,
    TableData,
    CodeData,
    QuestionData,
]


# ============================================================================
# Chat Message Types
# ============================================================================


class PendingMessage(BaseModel):
    """A message that is being streamed."""

    id: str
    role: MessageRole
    type: MessageType
    status: Literal["pending"] = "pending"
    timestamp: datetime


class CompleteMessage(BaseModel):
    """A fully received and complete message."""

    id: str
    role: MessageRole
    type: MessageType
    status: Literal["complete"] = "complete"
    data: MessageData
    timestamp: datetime


class UserMessage(CompleteMessage):
    """A complete text message sent by the user."""

    role: Literal["user"]
    type: Literal["text"]
    status: Literal["complete"] = "complete"
    data: TextData


Message = Union[PendingMessage, CompleteMessage]


# ============================================================================
# SSE Chunk Types
# ============================================================================


class SSEChunkBase(BaseModel):
    """Base SSE chunk carrying the message identifier shared by the stream pair."""

    id: str


class SSEChunkIncoming(SSEChunkBase):
    """Signals that a streamed message has started."""

    event: Literal["incoming"]
    type: MessageType


class SSEChunkData(SSEChunkBase):
    """Carries the payload for a streamed message."""

    event: Literal["data"]
    type: MessageType
    data: MessageData


class SSEChunkFinished(BaseModel):
    """Signals that the full SSE response is complete."""

    event: Literal["finished"]


SSEChunk = Union[SSEChunkIncoming, SSEChunkData, SSEChunkFinished]


# ============================================================================
# Chat Request/Response
# ============================================================================


class ChatRequestBody(BaseModel):
    """Request body for POST /chat/stream endpoint."""

    message: UserMessage
    database_id: str
    conversation_id: str
