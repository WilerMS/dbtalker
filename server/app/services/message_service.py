from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Message
from app.schemas.chat import CompleteMessage


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

    async def save_messages(
        self,
        conversation_id: str,
        messages: list[CompleteMessage],
    ) -> list[Message]:
        if not messages:
            return []

        payloads: list[dict[str, object]] = [
            {
                "id": message.id,
                "conversation_id": conversation_id,
                "role": message.role,
                "type": message.type,
                "status": message.status,
                "data": message.data.model_dump(by_alias=True),
                "timestamp": message.timestamp,
            }
            for message in messages
        ]

        query = insert(Message).values(payloads).returning(Message)
        result = await self._db.execute(query)
        await self._db.commit()
        return list(result.scalars().all())

    async def save_message(
        self, conversation_id: str, message: CompleteMessage
    ) -> Message:
        saved_messages = await self.save_messages(conversation_id, [message])
        return saved_messages[0]
