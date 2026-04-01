from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sse_starlette.sse import EventSourceResponse

from app.api.dependencies import chat_controller
from app.controllers.chat_controller import ChatController
from app.core.security import resolve_active_user
from app.schemas.chat import (
    ChatMessage,
    ChatRequestBody,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/messages", response_model=list[ChatMessage])
async def get_chat_messages(
    database_id: str = Query(...),
    conversation_id: str = Query(...),
    chat_controller: ChatController = Depends(chat_controller),
    active_user_id: str = Depends(resolve_active_user),
) -> list[ChatMessage]:

    return await chat_controller.get_messages(
        conversation_id=conversation_id, database_id=database_id, user_id=active_user_id
    )


@router.post("/stream")
async def stream_chat_post(
    request: ChatRequestBody,
    chat_controller: ChatController = Depends(chat_controller),
    active_user_id: str = Depends(resolve_active_user),
) -> EventSourceResponse:

    return EventSourceResponse(
        chat_controller.stream_chat(
            user_message=request.message,
            database_id=request.database_id,
            conversation_id=request.conversation_id,
            user_id=active_user_id,
        )
    )
