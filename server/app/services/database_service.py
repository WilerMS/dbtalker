from __future__ import annotations

import asyncio

from app.mocks.databases import (
    create_database as mock_create_database,
)
from app.mocks.databases import (
    delete_database as mock_delete_database,
)
from app.mocks.databases import (
    get_database as mock_get_database,
)
from app.mocks.databases import (
    get_databases as mock_get_databases,
)
from app.mocks.databases import (
    update_database as mock_update_database,
)
from app.models.database import (
    CreateDatabaseInput,
    DatabaseRecord,
    UpdateDatabaseInput,
)


class DatabaseService:
    def get_all_databases(self) -> list[DatabaseRecord]:
        return mock_get_databases()

    def get_database_by_id(self, database_id: str) -> DatabaseRecord | None:
        return mock_get_database(database_id)

    async def create_database(self, input_data: CreateDatabaseInput) -> DatabaseRecord:
        await asyncio.sleep(2)
        return mock_create_database(input_data)

    def update_database(
        self,
        database_id: str,
        input_data: UpdateDatabaseInput,
    ) -> DatabaseRecord | None:
        return mock_update_database(database_id, input_data)

    def delete_database(self, database_id: str) -> bool:
        return mock_delete_database(database_id)
