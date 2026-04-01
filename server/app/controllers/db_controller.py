from __future__ import annotations

from app.schemas.database import (
    CreateDatabaseInput,
    DatabaseResponseRecord,
    UpdateDatabaseInput,
)
from app.services.db_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class DatabaseController:
    def __init__(self, db_service: DatabaseService) -> None:
        self._service = db_service

    async def list_databases(self, user_id: str) -> list[DatabaseResponseRecord]:
        databases = await self._service.get_all_databases(user_id)
        return [DatabaseResponseRecord.from_database(database) for database in databases]

    async def get_database(
        self, database_id: str, user_id: str
    ) -> DatabaseResponseRecord:
        database = await self._service.get_database_by_id(database_id, user_id)
        if not database:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database(database)

    async def get_demo_database(self) -> DatabaseResponseRecord:
        database = await self._service.get_demo_database()
        if not database:
            raise ResourceNotFoundError("Demo database not found.")
        return DatabaseResponseRecord.from_database(database)

    async def create_database(
        self, input_data: CreateDatabaseInput, user_id: str
    ) -> DatabaseResponseRecord:
        created = await self._service.create_database(input_data, user_id)
        return DatabaseResponseRecord.from_database(created)

    async def update_database(
        self,
        database_id: str,
        input_data: UpdateDatabaseInput,
        user_id: str,
    ) -> DatabaseResponseRecord:
        updated = await self._service.update_database(database_id, input_data, user_id)
        if not updated:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database(updated)

    async def delete_database(self, database_id: str, user_id: str) -> bool:
        was_deleted = await self._service.delete_database(database_id, user_id)
        if not was_deleted:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return True
