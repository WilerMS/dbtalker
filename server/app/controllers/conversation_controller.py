"""
Conversation controller for orchestrating conversation operations.
Delegates business logic to ConversationService and DatabaseService.
Handles validation and HTTP-level concerns.
"""

from __future__ import annotations

from app.models.database import ConversationRecord
from app.services.conversation_service import ConversationService
from app.services.database_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class ConversationController:
    """
    Controller for conversation operations.
    Injects services and orchestrates domain logic.
    Validates that databases exist before creating conversations.
    """

    def __init__(
        self,
        conversation_service: ConversationService,
        database_service: DatabaseService,
    ) -> None:
        """Initialize ConversationController with injected services."""
        self._service = conversation_service
        self._database_service = database_service

    def get_conversations_by_database(self, database_id: str) -> list[ConversationRecord]:
        """
        Get all conversations for a database.

        Args:
            database_id: The ID of the database.

        Returns:
            List of conversations for the database.
        """
        if not self._database_service.get_database_by_id(database_id):
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return self._service.get_conversations_by_database(database_id)

    def create_conversation(
        self,
        database_id: str,
        title: str,
    ) -> ConversationRecord:
        """
        Create a new conversation for a database.

        Args:
            database_id: The ID of the database.
            title: The title of the conversation.

        Returns:
            The newly created ConversationRecord.
        """
        if not self._database_service.get_database_by_id(database_id):
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return self._service.create_conversation(database_id, title)

    def delete_conversation(self, database_id: str, conversation_id: str) -> bool:
        """Delete a conversation that belongs to the specified database."""
        if not self._database_service.get_database_by_id(database_id):
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")

        was_deleted = self._service.delete_conversation(database_id, conversation_id)
        if not was_deleted:
            raise ResourceNotFoundError(
                f"Conversation '{conversation_id}' not found for database '{database_id}'."
            )

        return True
