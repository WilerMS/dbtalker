from __future__ import annotations

from uuid import uuid4

from sqlalchemy import delete, insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Conversation
from app.schemas.conversation import CreateConversationInput


class ConversationService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_conversations_by_database(self, database_id: str) -> list[Conversation]:
        query = select(Conversation).where(Conversation.database_id == database_id)
        result = await self._db.execute(query)

        return list(result.scalars().all())

    async def create_conversation(
        self, input_data: CreateConversationInput
    ) -> Conversation:
        conversation_id = str(uuid4())
        query = (
            insert(Conversation)
            .values(
                id=conversation_id,
                database_id=input_data.database_id,
                title=input_data.title,
            )
            .returning(Conversation)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one()

    async def delete_conversation(self, database_id: str, conversation_id: str) -> bool:
        query = (
            delete(Conversation)
            .where(
                Conversation.id == conversation_id,
                Conversation.database_id == database_id,
            )
            .returning(Conversation.id)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one_or_none() is not None
