# models/domain.py
import uuid
from datetime import datetime
from typing import Any, Literal

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func

DatabaseEngine = Literal["postgresql"]


class Base(DeclarativeBase):
    pass


class Database(Base):
    __tablename__ = "databases"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    engine: Mapped[DatabaseEngine] = mapped_column(String(50), nullable=False)
    icon: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    # TODO: hash the connection details
    connection_data: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relation to conversations (1:N)
    conversations: Mapped[list["Conversation"]] = relationship(
        "Conversation", back_populates="database", cascade="all, delete-orphan"
    )


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    database_id: Mapped[str] = mapped_column(
        ForeignKey("databases.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relations
    database: Mapped["Database"] = relationship(
        "Database", back_populates="conversations"
    )
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    conversation_id: Mapped[str] = mapped_column(
        ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False
    )

    role: Mapped[str] = mapped_column(String(50), nullable=False)  # 'user' o 'bot'
    type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # 'text', 'bar', 'schema', etc.
    status: Mapped[str] = mapped_column(String(50), default="complete")

    # 🔥 LA MAGIA: Aquí vive tu Generative UI. Postgres guardará cualquier widget sin quejarse.
    data: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relations
    conversation: Mapped["Conversation"] = relationship(
        "Conversation", back_populates="messages"
    )
