from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass

from app.models.database import DatabaseRecord

MOCK_DATABASES: list[DatabaseRecord] = [
    DatabaseRecord(
        id="db-postgres",
        name="PostgreSQL",
        engine="postgresql",
        description="Operational commerce data",
        created_at=datetime(2026, 1, 10, 10, 0, 0),
        updated_at=datetime(2026, 1, 10, 10, 0, 0),
    ),
    DatabaseRecord(
        id="db-mongodb",
        name="MongoDB",
        engine="mongodb",
        description="Event stream and audit logs",
        created_at=datetime(2026, 1, 12, 14, 0, 0),
        updated_at=datetime(2026, 1, 12, 14, 0, 0),
    ),
    DatabaseRecord(
        id="db-sqlite",
        name="SQLite",
        engine="sqlite",
        description="Local analytics snapshot",
        created_at=datetime(2026, 1, 14, 9, 0, 0),
        updated_at=datetime(2026, 1, 14, 9, 0, 0),
    ),
]


def get_databases() -> list[DatabaseRecord]:
    """Get all mock databases."""
    return MOCK_DATABASES.copy()


def get_database(database_id: str) -> DatabaseRecord | None:
    """Get a single mock database by ID."""
    for db in MOCK_DATABASES:
        if db.id == database_id:
            return db
    return None
