from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import delete, insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Conversation
from app.schemas.chat import TextMessage
from app.schemas.conversation import CreateConversationInput
from app.schemas.widgets import TextData
from app.services.message_service import MessageService


class ConversationService:
    def __init__(self, db: AsyncSession, message_service: MessageService) -> None:
        self._db = db
        self._message_service = message_service

    async def get_conversations_by_database(
        self, database_id: str, user_id: str
    ) -> list[Conversation]:
        query = select(Conversation).where(
            Conversation.database_id == database_id, Conversation.user_id == user_id
        )
        result = await self._db.execute(query)

        return list(result.scalars().all())

    async def get_conversation_by_id(
        self, conversation_id: str, user_id: str
    ) -> Conversation | None:
        query = select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user_id
        )
        result = await self._db.execute(query)
        conversation = result.scalar_one_or_none()
        return conversation

    async def create_conversation(
        self,
        input_data: CreateConversationInput,
        user_id: str,
    ) -> Conversation:
        conversation_id = str(uuid4())
        query = (
            insert(Conversation)
            .values(
                id=conversation_id,
                database_id=input_data.database_id,
                title=input_data.title,
                user_id=user_id,
            )
            .returning(Conversation)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        conversation = result.scalar_one()

        welcome_message = TextMessage(
            id=str(uuid4()),
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "¡Hola! Puedes preguntarme lo que quieras sobre esta base de datos. "
                    "Puedo mostrarte los resultados de muchas formas: "
                    "📊 **gráficos de barras o líneas** para visualizar tendencias, "
                    "📋 **tablas** para explorar datos en detalle, "
                    "🔢 **KPIs** para métricas clave de un vistazo, "
                    "🗂️ **diagramas de esquema** para entender la estructura "
                    "de tus tablas, "
                    "o simplemente una **respuesta en texto**. "
                    "¡Pregúntame lo que necesites!"
                )
            ),
            timestamp=datetime.now(timezone.utc),
        )
        await self._message_service.save_message(conversation_id, welcome_message)

        return conversation

    async def delete_conversation(
        self, database_id: str, conversation_id: str, user_id: str
    ) -> bool:
        query = (
            delete(Conversation)
            .where(
                Conversation.id == conversation_id,
                Conversation.database_id == database_id,
                Conversation.user_id == user_id,
            )
            .returning(Conversation.id)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one_or_none() is not None
