from __future__ import annotations

from fastapi import APIRouter, Depends, status

# Dependency injection
from app.api.dependencies import conversation_controller
from app.controllers.conversation_controller import ConversationController
from app.core.security import resolve_active_user

# Schemas
from app.schemas.conversation import (
    ConversationRecord,
    CreateConversationInput,
)

router = APIRouter(prefix="/databases", tags=["Conversations"])


@router.get("/{database_id}/conversations", response_model=list[ConversationRecord])
async def get_conversations(
    database_id: str,
    conv_controller: ConversationController = Depends(conversation_controller),
    active_user_id: str = Depends(resolve_active_user),
) -> list[ConversationRecord]:

    return await conv_controller.get_conversations_by_database(
        database_id, active_user_id
    )


@router.post(
    "/{database_id}/conversations",
    response_model=ConversationRecord,
    status_code=status.HTTP_201_CREATED,
)
async def create_conversation(
    database_id: str,
    input_data: CreateConversationInput,
    conv_controller: ConversationController = Depends(conversation_controller),
    active_user_id: str = Depends(resolve_active_user),
) -> ConversationRecord:
    input_data.database_id = database_id
    return await conv_controller.create_conversation(input_data, active_user_id)


@router.delete(
    "/{database_id}/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_conversation(
    database_id: str,
    conversation_id: str,
    conv_controller: ConversationController = Depends(conversation_controller),
    active_user_id: str = Depends(resolve_active_user),
) -> None:
    await conv_controller.delete_conversation(
        database_id, conversation_id, active_user_id
    )
