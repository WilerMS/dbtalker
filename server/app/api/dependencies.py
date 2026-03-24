from __future__ import annotations

from fastapi import Depends

from app.controllers.chat_controller import ChatController
from app.controllers.conversation_controller import ConversationController
from app.controllers.database_controller import DatabaseController
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from app.services.database_service import DatabaseService


def get_database_service() -> DatabaseService:
    return DatabaseService()


def get_conversation_service(
    database_service: DatabaseService = Depends(get_database_service),
) -> ConversationService:
    return ConversationService(database_service=database_service)


def get_chat_service() -> ChatService:
    return ChatService()


def get_database_controller(
    database_service: DatabaseService = Depends(get_database_service),
) -> DatabaseController:
    return DatabaseController(database_service=database_service)


def get_conversation_controller(
    conversation_service: ConversationService = Depends(get_conversation_service),
    database_service: DatabaseService = Depends(get_database_service),
) -> ConversationController:
    return ConversationController(
        conversation_service=conversation_service,
        database_service=database_service,
    )


def get_chat_controller(
    chat_service: ChatService = Depends(get_chat_service),
    conversation_service: ConversationService = Depends(get_conversation_service),
    database_service: DatabaseService = Depends(get_database_service),
) -> ChatController:
    return ChatController(
        chat_service=chat_service,
        conversation_service=conversation_service,
        database_service=database_service,
    )
