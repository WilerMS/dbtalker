from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Message


class MessageService:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def get_messages_by_conversation_id(
        self, conversation_id: str
    ) -> list[Message]:
        query = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp)
        )
        result = await self._db.execute(query)
        return list(result.scalars().all())

    async def save_message(
        self,
        conversation_id: str,
        role: str,
        msg_type: str,
        data: dict,
        status: str = "complete",
    ) -> Message:
        query = (
            insert(Message)
            .values(
                conversation_id=conversation_id,
                role=role,
                type=msg_type,
                status=status,
                data=data,
            )
            .returning(Message)
        )
        result = await self._db.execute(query)
        await self._db.commit()
        return result.scalar_one()
