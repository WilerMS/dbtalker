"""
Chat streaming endpoint for DBTalker backend.
Implements SSE streaming for query responses with mock data.
"""

from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.mocks.chat_data import (
    detect_widget_type,
    generate_text_for_widget,
    get_widget_data_by_type,
)
from app.models.database import (
    ChatRequestBody,
    SSEChunkData,
    SSEChunkFinished,
    SSEChunkIncoming,
    TextData,
)

router = APIRouter(prefix="/chat", tags=["chat"])


async def chat_stream_generator(request: ChatRequestBody) -> AsyncGenerator[str, None]:
    database_id = getattr(request, "database_id", "unknown")
    query_text = request.data.text
    primary_widget_type = detect_widget_type(query_text)

    # SEQUENCE 1: Text Message

    yield _serialize_sse_chunk(SSEChunkIncoming(event="incoming", type="text"))

    await asyncio.sleep(0.5)

    text_content = generate_text_for_widget(primary_widget_type, database_id)
    text_chunk = SSEChunkData(
        event="data",
        type="text",
        data=TextData(text=text_content),
    )
    yield _serialize_sse_chunk(text_chunk)

    # SEQUENCE 2: Primary Widget (if detected)

    if primary_widget_type:
        await asyncio.sleep(0.5)

        yield _serialize_sse_chunk(SSEChunkIncoming(event="incoming", type=primary_widget_type))

        await asyncio.sleep(0.5)

        widget_data = get_widget_data_by_type(primary_widget_type)
        widget_chunk = SSEChunkData(
            event="data",
            type=primary_widget_type,
            data=widget_data,
        )
        yield _serialize_sse_chunk(widget_chunk)

        # SEQUENCE 3: Secondary Widget (always bar chart as fallback)

        secondary_widget_type = "bar" if primary_widget_type != "bar" else "line"

        await asyncio.sleep(0.5)

        yield _serialize_sse_chunk(SSEChunkIncoming(event="incoming", type=secondary_widget_type))

        await asyncio.sleep(0.5)

        secondary_widget_data = get_widget_data_by_type(secondary_widget_type)
        secondary_chunk = SSEChunkData(
            event="data",
            type=secondary_widget_type,
            data=secondary_widget_data,
        )
        yield _serialize_sse_chunk(secondary_chunk)

    # END: Finished Signal

    await asyncio.sleep(0.2)
    yield _serialize_sse_chunk(SSEChunkFinished(event="finished"))


def _serialize_sse_chunk(chunk) -> str:
    return chunk.model_dump_json(by_alias=True)


@router.post("/stream")
async def stream_chat(request: ChatRequestBody) -> EventSourceResponse:
    return EventSourceResponse(chat_stream_generator(request))
