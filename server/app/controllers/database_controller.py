from __future__ import annotations

from app.models.database import (
    CreateDatabaseInput,
    DatabaseResponseRecord,
    UpdateDatabaseInput,
)
from app.services.database_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class DatabaseController:
    def __init__(self, database_service: DatabaseService) -> None:
        self._service = database_service

    def list_databases(self) -> list[DatabaseResponseRecord]:
        databases = self._service.get_all_databases()
        return [DatabaseResponseRecord.from_database_record(database) for database in databases]

    def get_database(self, database_id: str) -> DatabaseResponseRecord:
        database = self._service.get_database_by_id(database_id)
        if not database:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database_record(database)

    async def create_database(self, input_data: CreateDatabaseInput) -> DatabaseResponseRecord:
        created = await self._service.create_database(input_data)
        return DatabaseResponseRecord.from_database_record(created)

    def update_database(
        self,
        database_id: str,
        input_data: UpdateDatabaseInput,
    ) -> DatabaseResponseRecord:
        updated = self._service.update_database(database_id, input_data)
        if not updated:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return DatabaseResponseRecord.from_database_record(updated)

    def delete_database(self, database_id: str) -> bool:
        was_deleted = self._service.delete_database(database_id)
        if not was_deleted:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return True
