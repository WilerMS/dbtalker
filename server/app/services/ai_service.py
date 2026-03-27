from __future__ import annotations

import asyncio
import uuid
from collections.abc import AsyncGenerator

from pydantic import TypeAdapter

from app.mocks.chat_data import get_widget_data_by_type
from app.schemas.chat import CompleteMessage, UserMessage
from app.schemas.streaming import SSEChunk, SSEChunkData, SSEChunkIncoming
from app.schemas.widgets import MessageData, TextData


class AIService:
    async def generate_dynamic_stream(
        self, user_message: UserMessage, history: list[CompleteMessage], database_id: str
    ) -> AsyncGenerator[SSEChunk, None]:

        # TODO: pasar todo a openai con el 'history':
        # messages = [{"role": msg.role, "content": msg.data.text} for msg in history]

        text_lower = user_message.data.text.lower()

        if "informe" in text_lower:
            text_id = str(uuid.uuid4())
            yield SSEChunkIncoming(id=text_id, event="incoming", type="text")

            await asyncio.sleep(0.5)
            yield SSEChunkData(
                id=text_id,
                event="data",
                type="text",
                data=TextData(
                    text="Preparando el informe basado en nuestro chat anterior..."
                ),
            )

            bar_id = str(uuid.uuid4())
            yield SSEChunkIncoming(id=bar_id, event="incoming", type="bar")

            await asyncio.sleep(2.5)
            bar_data = get_widget_data_by_type("bar")
            normalized_bar_data = TypeAdapter(MessageData).validate_python(
                bar_data.model_dump(by_alias=True)
            )
            yield SSEChunkData(
                id=bar_id,
                event="data",
                type="bar",
                data=normalized_bar_data,
            )

            return

        else:
            default_id = str(uuid.uuid4())
            yield SSEChunkIncoming(id=default_id, event="incoming", type="text")

            await asyncio.sleep(0.5)
            yield SSEChunkData(
                id=default_id,
                event="data",
                type="text",
                data=TextData(
                    text="Entendido. Procesando tu consulta con el historial actual."
                ),
            )
