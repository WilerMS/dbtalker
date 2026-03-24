"""Chat routes for DBTalkie backend."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sse_starlette.sse import EventSourceResponse

from app.api.dependencies import get_chat_controller
from app.controllers.chat_controller import ChatController
from app.models.database import (
    ChatRequestBody,
    CompleteMessage,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/messages", response_model=list[CompleteMessage])
async def get_chat_messages(
    database_id: str = Query(...),
    conversation_id: str = Query(...),
    chat_controller: ChatController = Depends(get_chat_controller),
) -> list[CompleteMessage]:
    return chat_controller.get_messages(conversation_id, database_id)


@router.get("/stream")
async def stream_chat(
    query: str = Query(..., min_length=1),
    database_id: str = Query(...),
    conversation_id: str = Query(...),
    chat_controller: ChatController = Depends(get_chat_controller),
) -> EventSourceResponse:
    return EventSourceResponse(
        chat_controller.stream_chat(
            query=query,
            database_id=database_id,
            conversation_id=conversation_id,
        )
    )


@router.post("/stream")
async def stream_chat_post(
    request: ChatRequestBody,
    chat_controller: ChatController = Depends(get_chat_controller),
) -> EventSourceResponse:
    return EventSourceResponse(
        chat_controller.stream_chat(
            query=request.data.text,
            database_id=request.database_id,
            conversation_id=request.conversation_id,
        )
    )
