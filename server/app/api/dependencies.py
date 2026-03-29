from __future__ import annotations

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.chat_controller import ChatController
from app.controllers.conversation_controller import ConversationController
from app.controllers.db_controller import DatabaseController
from app.core.database import get_db
from app.services.ai_service.ai_service import AIService
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from app.services.db_service import DatabaseService
from app.services.message_service import MessageService


# Services
def db_service(
    db: AsyncSession = Depends(get_db),
) -> DatabaseService:
    return DatabaseService(db)


def conversation_service(
    db: AsyncSession = Depends(get_db),
) -> ConversationService:
    return ConversationService(db=db)


def message_service(
    db: AsyncSession = Depends(get_db),
) -> MessageService:
    return MessageService(db=db)


def ai_service() -> AIService:
    return AIService()


def chat_service(
    message_service: MessageService = Depends(message_service),
    ai_service: AIService = Depends(ai_service),
) -> ChatService:
    return ChatService(message_service=message_service, ai_service=ai_service)


# Controllers
def db_controller(
    db_service: DatabaseService = Depends(db_service),
) -> DatabaseController:
    return DatabaseController(db_service=db_service)


def conversation_controller(
    conversation_service: ConversationService = Depends(conversation_service),
) -> ConversationController:
    return ConversationController(
        conversation_service=conversation_service,
    )


def chat_controller(
    chat_service: ChatService = Depends(chat_service),
    conversation_service: ConversationService = Depends(conversation_service),
    db_service: DatabaseService = Depends(db_service),
) -> ChatController:
    return ChatController(
        chat_service=chat_service,
        conversation_service=conversation_service,
        db_service=db_service,
    )
