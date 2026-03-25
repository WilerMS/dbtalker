"""
Chat service for managing chat streaming and message generation.
Encapsulates chat logic using POO.
Currently imports from mocks; prepared for future LLM integration.
"""

from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator
from datetime import datetime
from uuid import uuid4

from app.mocks.chat_data import (
    append_message_to_conversation,
    detect_widget_type,
    generate_closing_text,
    generate_text_for_widget,
    get_messages_for_conversation,
    get_widget_data_by_type,
)
from app.models.database import (
    CompleteMessage,
    MessageType,
    SSEChunkData,
    SSEChunkFinished,
    SSEChunkIncoming,
    TextData,
    UserMessage,
)


class ChatService:
    def detect_widget_type(self, query: str) -> MessageType | None:
        return detect_widget_type(query)

    def generate_response_stream(
        self,
        user_message: UserMessage,
        database_id: str,
        conversation_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:
        return self._stream_generator(user_message, database_id, conversation_id)

    async def _stream_generator(
        self,
        user_message: UserMessage,
        database_id: str,
        conversation_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:
        """
        Internal generator for SSE sequences.
        Implements exact timing and event order from original spec.
        """
        append_message_to_conversation(conversation_id, user_message)
        query_text = user_message.data.text

        primary_widget_type = self.detect_widget_type(query_text)

        # SEQUENCE 1: Text Message
        text_message_id = str(uuid4())
        await asyncio.sleep(0.9)

        yield self._serialize_sse_chunk(
            SSEChunkIncoming(id=text_message_id, event="incoming", type="text"),
        )

        await asyncio.sleep(0.7)

        text_content = generate_text_for_widget(primary_widget_type, database_id)
        text_chunk = SSEChunkData(
            id=text_message_id,
            event="data",
            type="text",
            data=TextData(text=text_content),
        )
        bot_text_message = CompleteMessage(
            id=text_message_id,
            role="bot",
            type="text",
            status="complete",
            data=TextData(text=text_content),
            timestamp=datetime.now(),
        )
        append_message_to_conversation(conversation_id, bot_text_message)
        yield self._serialize_sse_chunk(text_chunk)

        # SEQUENCE 2: Primary Widget (if detected)
        if primary_widget_type:
            widget_message_id = str(uuid4())
            await asyncio.sleep(0.5)

            yield self._serialize_sse_chunk(
                SSEChunkIncoming(
                    id=widget_message_id,
                    event="incoming",
                    type=primary_widget_type,
                ),
            )

            await asyncio.sleep(2.9)

            widget_data = get_widget_data_by_type(primary_widget_type)
            widget_chunk = SSEChunkData(
                id=widget_message_id,
                event="data",
                type=primary_widget_type,
                data=widget_data,
            )
            bot_widget_message = CompleteMessage(
                id=widget_message_id,
                role="bot",
                type=primary_widget_type,
                status="complete",
                data=widget_data,
                timestamp=datetime.now(),
            )
            append_message_to_conversation(conversation_id, bot_widget_message)
            yield self._serialize_sse_chunk(widget_chunk)

            # SEQUENCE 3: Closing suggestion text
            closing_message_id = str(uuid4())
            await asyncio.sleep(0.5)

            yield self._serialize_sse_chunk(
                SSEChunkIncoming(
                    id=closing_message_id,
                    event="incoming",
                    type="text",
                ),
            )

            await asyncio.sleep(0.7)

            closing_text = generate_closing_text(primary_widget_type)
            closing_chunk = SSEChunkData(
                id=closing_message_id,
                event="data",
                type="text",
                data=TextData(text=closing_text),
            )
            bot_closing_message = CompleteMessage(
                id=closing_message_id,
                role="bot",
                type="text",
                status="complete",
                data=TextData(text=closing_text),
                timestamp=datetime.now(),
            )
            append_message_to_conversation(conversation_id, bot_closing_message)
            yield self._serialize_sse_chunk(closing_chunk)

        await asyncio.sleep(0.2)
        yield self._serialize_sse_chunk(SSEChunkFinished(event="finished"))

    def _serialize_sse_chunk(
        self,
        chunk: SSEChunkIncoming | SSEChunkData | SSEChunkFinished,
    ) -> dict[str, str]:
        return {
            "event": "message",
            "data": chunk.model_dump_json(by_alias=True),
        }

    def get_conversation_messages(
        self,
        conversation_id: str,
        database_id: str,
    ) -> list[CompleteMessage]:
        return get_messages_for_conversation(conversation_id, database_id)
