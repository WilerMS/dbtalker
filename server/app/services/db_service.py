from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.domain import Database
from app.schemas.database import CreateDatabaseInput, UpdateDatabaseInput


class DatabaseService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_all_databases(self, user_id: str) -> list[Database]:
        query = select(Database).where(Database.user_id == user_id)
        result = await self._db.execute(query)
        return list(result.scalars().all())

    async def get_database_by_id(self, database_id: str, user_id: str) -> Database | None:
        query = select(Database).where(
            Database.id == database_id, Database.user_id == user_id
        )
        result = await self._db.execute(query)
        return result.scalar_one_or_none()

    async def get_demo_database(self) -> Database | None:
        query = select(Database).where(Database.id == settings.demo_db_id)
        result = await self._db.execute(query)
        return result.scalar_one_or_none()

    async def create_database(
        self, input_data: CreateDatabaseInput, user_id: str
    ) -> Database:
        query = (
            insert(Database)
            .values(
                name=input_data.name,
                engine=input_data.engine,
                description=input_data.description,
                icon=input_data.icon or "Database",
                connection_data=input_data.connection.model_dump(),
                user_id=user_id,
            )
            .returning(Database)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one()

    async def update_database(
        self, database_id: str, input_data: UpdateDatabaseInput, user_id: str
    ) -> Database | None:
        update_data = input_data.model_dump(exclude_unset=True)

        # If no fields to update, just return the existing record
        if not update_data:
            return await self.get_database_by_id(database_id, user_id)

        query = (
            update(Database)
            .where(Database.id == database_id, Database.user_id == user_id)
            .values(**update_data)
            .returning(Database)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one_or_none()

    async def delete_database(self, database_id: str, user_id: str) -> bool:
        query = (
            delete(Database)
            .where(Database.id == database_id, Database.user_id == user_id)
            .returning(Database.id)
        )

        result = await self._db.execute(query)
        await self._db.commit()

        return result.scalar_one_or_none() is not None
