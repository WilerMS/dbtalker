from __future__ import annotations

from collections.abc import AsyncGenerator
from datetime import datetime, timezone

from app.schemas.chat import (
    BOT_MESSAGE_CLASSES,
    ChatMessage,
    TextMessage,
    UserMessage,
)
from app.schemas.database import DatabaseRecord
from app.schemas.streaming import (
    SSEChunk,
    SSEChunkFinished,
)
from app.services.ai_service.ai_service import AIService
from app.services.message_service import MessageService


class ChatService:
    def __init__(self, message_service: MessageService, ai_service: AIService):
        self._message_service = message_service
        self._ai_service = ai_service

    async def get_conversation_messages(self, conversation_id: str) -> list[ChatMessage]:
        db_messages = await self._message_service.get_messages_by_conversation_id(
            conversation_id
        )

        chat_messages: list[ChatMessage] = []

        for msg in db_messages:
            if msg.role == "user":
                valid_msg = UserMessage.model_validate(msg, from_attributes=True)
                chat_messages.append(valid_msg)

            elif msg.role == "bot":
                MessageClass = BOT_MESSAGE_CLASSES.get(msg.type, TextMessage)
                valid_msg = MessageClass.model_validate(msg, from_attributes=True)
                chat_messages.append(valid_msg)

        return chat_messages

    async def generate_response_stream(
        self,
        conversation_id: str,
        user_message: UserMessage,
        database: DatabaseRecord,
    ) -> AsyncGenerator[dict[str, str], None]:

        new_messages: list[ChatMessage] = []

        # Save the user message to ensure it's saved if any error occurs during streaming
        await self._message_service.save_message(
            conversation_id,
            user_message,
        )

        history = await self.get_conversation_messages(conversation_id)

        async for chunk in self._ai_service.generate_dynamic_stream(history, database):
            if chunk.event == "incoming":
                yield self._serialize_sse_chunk(chunk)

            elif chunk.event == "data":
                yield self._serialize_sse_chunk(chunk)

                MessageClass = BOT_MESSAGE_CLASSES.get(chunk.type, TextMessage)
                new_messages.append(
                    MessageClass(
                        id=chunk.id,
                        role="bot",
                        type=chunk.type,
                        status="complete",
                        data=chunk.data,
                        timestamp=datetime.now(timezone.utc),
                    )
                )

        # Save all bot messages at the end of the stream
        await self._message_service.save_messages(
            conversation_id,
            new_messages,
        )
        yield self._serialize_sse_chunk(SSEChunkFinished(event="finished"))

    def _serialize_sse_chunk(self, chunk: SSEChunk) -> dict[str, str]:
        return {
            "event": "message",
            "data": chunk.model_dump_json(by_alias=True),
        }
