from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.dependencies import (
    get_conversation_controller,
    get_database_controller,
)
from app.controllers.conversation_controller import ConversationController
from app.controllers.database_controller import DatabaseController
from app.models.database import (
    ConversationRecord,
    CreateConversationInput,
    CreateDatabaseInput,
    DatabaseResponseRecord,
    UpdateDatabaseInput,
)

router = APIRouter(prefix="/databases", tags=["databases"])

DatabaseControllerDep = Annotated[DatabaseController, Depends(get_database_controller)]
ConversationControllerDep = Annotated[
    ConversationController,
    Depends(get_conversation_controller),
]


@router.get("/", response_model=list[DatabaseResponseRecord])
async def list_databases(
    database_controller: DatabaseControllerDep,
) -> list[DatabaseResponseRecord]:
    return database_controller.list_databases()


@router.get("/{database_id}", response_model=DatabaseResponseRecord)
async def get_database_by_id(
    database_id: str,
    database_controller: DatabaseControllerDep,
) -> DatabaseResponseRecord:
    return database_controller.get_database(database_id)


@router.post(
    "/",
    response_model=DatabaseResponseRecord,
    status_code=status.HTTP_201_CREATED,
)
async def create_database_endpoint(
    input_data: CreateDatabaseInput,
    database_controller: DatabaseControllerDep,
) -> DatabaseResponseRecord:
    return await database_controller.create_database(input_data)


@router.patch("/{database_id}", response_model=DatabaseResponseRecord)
async def update_database_endpoint(
    database_id: str,
    input_data: UpdateDatabaseInput,
    database_controller: DatabaseControllerDep,
) -> DatabaseResponseRecord:
    return database_controller.update_database(database_id, input_data)


@router.delete("/{database_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_database_endpoint(
    database_id: str,
    database_controller: DatabaseControllerDep,
) -> None:
    database_controller.delete_database(database_id)


# Conversation endpoints
@router.get("/{database_id}/conversations", response_model=list[ConversationRecord])
async def get_conversations(
    database_id: str,
    conversation_controller: ConversationControllerDep,
) -> list[ConversationRecord]:
    """Get all conversations for a database."""
    return conversation_controller.get_conversations_by_database(database_id)


@router.post(
    "/{database_id}/conversations",
    response_model=ConversationRecord,
    status_code=status.HTTP_201_CREATED,
)
async def create_conversation_endpoint(
    database_id: str,
    input_data: CreateConversationInput,
    conversation_controller: ConversationControllerDep,
) -> ConversationRecord:
    """Create a new conversation for a database."""
    return conversation_controller.create_conversation(database_id, input_data.title)


@router.delete(
    "/{database_id}/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_conversation_endpoint(
    database_id: str,
    conversation_id: str,
    conversation_controller: ConversationControllerDep,
) -> None:
    """Delete a conversation for a database."""
    conversation_controller.delete_conversation(database_id, conversation_id)
