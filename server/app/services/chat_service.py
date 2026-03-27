from __future__ import annotations

from collections.abc import AsyncGenerator

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
        return [CompleteMessage.model_validate(msg) for msg in db_messages]

    async def generate_response_stream(
        self,
        user_message: UserMessage,
        database_id: str,
        conversation_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:

        # TODO: summarize history to save tokens in large conversations
        history = await self.get_conversation_messages(conversation_id)

        # This saves the user's message inmediately
        await self._message_service.save_message(
            conversation_id, "user", "text", user_message.data.model_dump(by_alias=True)
        )

        async for chunk in self._ai_service.generate_dynamic_stream(
            user_message, history, database_id
        ):
            if chunk.event == "incoming":
                yield self._serialize_sse_chunk(chunk)

            elif chunk.event == "data":
                yield self._serialize_sse_chunk(chunk)

                await self._message_service.save_message(
                    conversation_id,
                    "bot",
                    chunk.type,
                    chunk.data.model_dump(by_alias=True),
                )

        yield self._serialize_sse_chunk(SSEChunkFinished(event="finished"))

    def _serialize_sse_chunk(self, chunk: SSEChunk) -> dict[str, str]:
        return {
            "event": "message",
            "data": chunk.model_dump_json(by_alias=True),
        }
