"""
Chat controller for orchestrating chat operations.
Delegates streaming and message logic to ChatService.
Handles validation of conversation/database context.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from app.models.database import CompleteMessage, UserMessage
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from app.services.database_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class ChatController:
    """
    Controller for chat operations.
    Injects services and validates context (database, conversation existence).
    Delegates actual chat logic to ChatService.
    """

    def __init__(
        self,
        chat_service: ChatService,
        conversation_service: ConversationService,
        database_service: DatabaseService,
    ) -> None:
        """Initialize ChatController with injected services."""
        self._chat_service = chat_service
        self._conversation_service = conversation_service
        self._database_service = database_service

    def _validate_database_and_conversation(
        self,
        database_id: str,
        conversation_id: str,
    ) -> None:
        if not self._database_service.get_database_by_id(database_id):
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")

        conversations = self._conversation_service.get_conversations_by_database(database_id)
        if not any(conversation.id == conversation_id for conversation in conversations):
            raise ResourceNotFoundError(
                f"Conversation '{conversation_id}' not found in database '{database_id}'."
            )

    async def stream_chat(
        self,
        user_message: UserMessage,
        database_id: str,
        conversation_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:
        """
        Stream chat response for a query.
        Validates database and conversation exist before streaming.

        Args:
            user_message: The complete user message payload from the frontend.
            database_id: The database context (must exist).
            conversation_id: The conversation context (validated if provided).

        Yields:
            SSE chunk dictionaries with event and data fields.

        Raises:
            ResourceNotFoundError: If database or conversation doesn't exist.
        """
        self._validate_database_and_conversation(database_id, conversation_id)

        # Delegate to chat service for streaming
        async for chunk in self._chat_service.generate_response_stream(
            user_message, database_id, conversation_id
        ):
            yield chunk

    def get_messages(
        self,
        conversation_id: str,
        database_id: str,
    ) -> list[CompleteMessage]:
        """
        Get all messages for a conversation.

        Args:
            conversation_id: The conversation ID.
            database_id: The database context.

        Returns:
            List of complete messages in the conversation.
        """
        self._validate_database_and_conversation(database_id, conversation_id)
        return self._chat_service.get_conversation_messages(conversation_id, database_id)
