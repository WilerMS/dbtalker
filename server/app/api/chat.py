from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sse_starlette.sse import EventSourceResponse

from app.api.dependencies import chat_controller
from app.controllers.chat_controller import ChatController
from app.schemas.chat import (
    ChatRequestBody,
    CompleteMessage,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/messages", response_model=list[CompleteMessage])
async def get_chat_messages(
    database_id: str = Query(...),
    conversation_id: str = Query(...),
    chat_controller: ChatController = Depends(chat_controller),
) -> list[CompleteMessage]:
    return await chat_controller.get_messages(conversation_id, database_id)


@router.post("/stream")
async def stream_chat_post(
    request: ChatRequestBody,
    chat_controller: ChatController = Depends(chat_controller),
) -> EventSourceResponse:
    return EventSourceResponse(
        chat_controller.stream_chat(
            user_message=request.message,
            database_id=request.database_id,
            conversation_id=request.conversation_id,
        )
    )
