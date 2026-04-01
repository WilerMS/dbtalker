from __future__ import annotations

from app.schemas.conversation import (
    ConversationRecord,
    CreateConversationInput,
)
from app.services.conversation_service import ConversationService
from app.services.message_service import MessageService
from app.utility.errors import ResourceNotFoundError


class ConversationController:
    def __init__(
        self,
        conversation_service: ConversationService,
        message_service: MessageService,
    ) -> None:
        self._conversation_service = conversation_service
        self._message_service = message_service

    async def get_conversations_by_database(
        self, database_id: str
    ) -> list[ConversationRecord]:
        conversations = await self._conversation_service.get_conversations_by_database(
            database_id
        )
        return [
            ConversationRecord.model_validate(conversation)
            for conversation in conversations
        ]

    async def create_conversation(
        self, input_data: CreateConversationInput
    ) -> ConversationRecord:
        created = await self._conversation_service.create_conversation(input_data)
        return ConversationRecord.model_validate(created)

    async def delete_conversation(self, database_id: str, conversation_id: str) -> bool:
        was_deleted = await self._conversation_service.delete_conversation(
            database_id, conversation_id
        )
        if not was_deleted:
            raise ResourceNotFoundError(
                f"Conversation '{conversation_id}' not found in database '{database_id}'."
            )
        return True
