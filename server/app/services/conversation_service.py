"""
Conversation service for managing chat conversations.
Encapsulates conversation operations using POO.
Currently imports from mocks; prepared for future DB migration.
"""

from __future__ import annotations

from app.mocks.conversations import (
    create_conversation as mock_create_conversation,
)
from app.mocks.conversations import (
    get_conversations_by_database as mock_get_conversations_by_database,
)
from app.models.database import ConversationRecord
from app.services.database_service import DatabaseService


class ConversationService:
    def __init__(self, database_service: DatabaseService) -> None:
        self._database_service = database_service

    def get_conversations_by_database(self, database_id: str) -> list[ConversationRecord]:
        return mock_get_conversations_by_database(database_id)

    def create_conversation(self, database_id: str, title: str) -> ConversationRecord:
        return mock_create_conversation(database_id, title)
