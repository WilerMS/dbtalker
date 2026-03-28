from __future__ import annotations

from collections.abc import AsyncGenerator
from datetime import datetime, timezone

from app.schemas.chat import (
    CompleteMessage,
    UserMessage,
)
from app.schemas.streaming import (
    SSEChunk,
    SSEChunkFinished,
)
from app.services.ai_service import AIService
from app.services.message_service import MessageService


class ChatService:
    def __init__(self, message_service: MessageService, ai_service: AIService):
        self._message_service = message_service
        self._ai_service = ai_service

    async def get_conversation_messages(
        self, conversation_id: str
    ) -> list[CompleteMessage]:
        db_messages = await self._message_service.get_messages_by_conversation_id(
            conversation_id
        )
        return [
            CompleteMessage.model_validate(msg, from_attributes=True)
            for msg in db_messages
        ]

    async def generate_response_stream(
        self,
        user_message: UserMessage,
        database_id: str,
        conversation_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:

        new_conversation_messages: list[CompleteMessage] = [user_message]

        # TODO: summarize history to save tokens in large conversations
        history = await self.get_conversation_messages(conversation_id)

        async for chunk in self._ai_service.generate_dynamic_stream(
            user_message, history, database_id
        ):
            if chunk.event == "incoming":
                yield self._serialize_sse_chunk(chunk)

            elif chunk.event == "data":
                yield self._serialize_sse_chunk(chunk)

                new_conversation_messages.append(
                    CompleteMessage(
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
            new_conversation_messages,
        )
        yield self._serialize_sse_chunk(SSEChunkFinished(event="finished"))

    def _serialize_sse_chunk(self, chunk: SSEChunk) -> dict[str, str]:
        return {
            "event": "message",
            "data": chunk.model_dump_json(by_alias=True),
        }
