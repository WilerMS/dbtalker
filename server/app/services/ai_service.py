from __future__ import annotations

import asyncio
import uuid
from collections.abc import AsyncGenerator

from pydantic import TypeAdapter

from app.mocks.chat_data import (
    detect_widget_type,
    generate_closing_text,
    generate_text_for_widget,
    get_widget_data_by_type,
)
from app.schemas.chat import CompleteMessage, UserMessage
from app.schemas.streaming import SSEChunk, SSEChunkData, SSEChunkIncoming
from app.schemas.widgets import MessageData, TextData


class AIService:
    async def generate_dynamic_stream(
        self, user_message: UserMessage, history: list[CompleteMessage], database_id: str
    ) -> AsyncGenerator[SSEChunk, None]:
        del history

        widget_type = detect_widget_type(user_message.data.text)

        # If no widget keyword is detected, respond with a single guidance text.
        if widget_type is None:
            fallback_id = str(uuid.uuid4())
            await asyncio.sleep(0.5)
            yield SSEChunkIncoming(id=fallback_id, event="incoming", type="text")
            await asyncio.sleep(1.5)
            yield SSEChunkData(
                id=fallback_id,
                event="data",
                type="text",
                data=TextData(text=generate_text_for_widget(None, database_id)),
            )
            return

        intro_text_id = str(uuid.uuid4())
        intro_text = generate_text_for_widget(widget_type, database_id)
        await asyncio.sleep(0.5)
        yield SSEChunkIncoming(id=intro_text_id, event="incoming", type="text")
        await asyncio.sleep(1.5)
        yield SSEChunkData(
            id=intro_text_id,
            event="data",
            type="text",
            data=TextData(text=intro_text),
        )

        widget_id = str(uuid.uuid4())
        widget_data = get_widget_data_by_type(widget_type)
        normalized_widget_data = TypeAdapter(MessageData).validate_python(
            widget_data.model_dump(by_alias=True)
        )
        await asyncio.sleep(0.5)
        yield SSEChunkIncoming(id=widget_id, event="incoming", type=widget_type)
        await asyncio.sleep(1.5)
        yield SSEChunkData(
            id=widget_id,
            event="data",
            type=widget_type,
            data=normalized_widget_data,
        )

        closing_text_id = str(uuid.uuid4())
        closing_text = generate_closing_text(widget_type)
        await asyncio.sleep(0.5)
        yield SSEChunkIncoming(id=closing_text_id, event="incoming", type="text")
        await asyncio.sleep(1.5)
        yield SSEChunkData(
            id=closing_text_id,
            event="data",
            type="text",
            data=TextData(text=closing_text),
        )
