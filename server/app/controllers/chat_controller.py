from __future__ import annotations

from collections.abc import AsyncGenerator

from app.schemas.chat import (
    ChatMessage,
    UserMessage,
)
from app.schemas.database import DatabaseConnection, DatabaseRecord
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from app.services.db_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class ChatController:
    def __init__(
        self,
        chat_service: ChatService,
        conversation_service: ConversationService,
        db_service: DatabaseService,
    ) -> None:
        self._chat_service = chat_service
        self._conversation_service = conversation_service
        self._db_service = db_service

    async def get_messages(
        self,
        conversation_id: str,
        database_id: str,
        user_id: str,
    ) -> list[ChatMessage]:
        await self._validate_database_and_conversation(
            database_id, conversation_id, user_id
        )
        return await self._chat_service.get_conversation_messages(conversation_id)

    async def stream_chat(
        self,
        database_id: str,
        user_message: UserMessage,
        conversation_id: str,
        user_id: str,
    ) -> AsyncGenerator[dict[str, str], None]:
        database = await self._validate_database_and_conversation(
            database_id, conversation_id, user_id
        )

        # Delegate to chat service for streaming
        async for chunk in self._chat_service.generate_response_stream(
            conversation_id, user_message, database
        ):
            yield chunk

    async def _validate_database_and_conversation(
        self,
        database_id: str,
        conversation_id: str,
        user_id: str,
    ) -> DatabaseRecord:

        # 1. Checking the database existence and ownership
        database = await self._db_service.get_database_by_id(database_id, user_id=user_id)
        if not database:
            raise ResourceNotFoundError(
                f"Database '{database_id}' from user '{user_id}' not found."
            )

        # 2. Checking the conversation existence, ownership and that it belongs to the database
        conversation = await self._conversation_service.get_conversation_by_id(
            conversation_id, user_id=user_id
        )

        if not conversation or conversation.database_id != database_id:
            raise ResourceNotFoundError(
                f"Conversation '{conversation_id}' not found or access denied."
            )

        return DatabaseRecord(
            id=database.id,
            name=database.name,
            engine=database.engine,
            icon=database.icon,
            description=database.description,
            connection=DatabaseConnection(
                host=database.connection_data["host"],
                port=database.connection_data["port"],
                database=database.connection_data["database"],
                username=database.connection_data["user"],
                password=database.connection_data["password"],
                use_ssl=False,
            ),
            created_at=database.created_at,
            updated_at=database.updated_at,
        )
