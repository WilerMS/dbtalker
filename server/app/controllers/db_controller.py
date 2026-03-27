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

    async def list_databases(self) -> list[DatabaseResponseRecord]:
        databases = await self._service.get_all_databases()
        return [DatabaseResponseRecord.from_database(database) for database in databases]

    async def get_database(self, database_id: str) -> DatabaseResponseRecord:
        database = await self._service.get_database_by_id(database_id)
        if not database:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database(database)

    async def create_database(
        self, input_data: CreateDatabaseInput
    ) -> DatabaseResponseRecord:
        created = await self._service.create_database(input_data)
        return DatabaseResponseRecord.from_database(created)

    async def update_database(
        self,
        database_id: str,
        input_data: UpdateDatabaseInput,
    ) -> DatabaseResponseRecord:
        updated = await self._service.update_database(database_id, input_data)
        if not updated:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database(updated)

    async def delete_database(self, database_id: str) -> bool:
        was_deleted = await self._service.delete_database(database_id)
        if not was_deleted:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return True
