from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from app.models.database import CreateDatabaseInput, DatabaseRecord, UpdateDatabaseInput

_databases: list[DatabaseRecord] = [
    DatabaseRecord(
        id="db-postgres",
        name="PostgreSQL",
        engine="postgresql",
        icon="Database",
        description="Operational commerce data",
        created_at=datetime(2026, 1, 10, 10, 0, 0),
        updated_at=datetime(2026, 1, 10, 10, 0, 0),
    ),
    DatabaseRecord(
        id="db-mongodb",
        name="MongoDB",
        engine="mongodb",
        icon="Leaf",
        description="Event stream and audit logs",
        created_at=datetime(2026, 1, 12, 14, 0, 0),
        updated_at=datetime(2026, 1, 12, 14, 0, 0),
    ),
    DatabaseRecord(
        id="db-sqlite",
        name="SQLite",
        engine="sqlite",
        icon="HardDrive",
        description="Local analytics snapshot",
        created_at=datetime(2026, 1, 14, 9, 0, 0),
        updated_at=datetime(2026, 1, 14, 9, 0, 0),
    ),
]


def _normalize_database_name(name: str) -> str:
    normalized = "".join(
        character if character.isalnum() else "-" for character in name.strip().lower()
    )
    normalized = "-".join(segment for segment in normalized.split("-") if segment)
    return normalized


def _build_database_id(name: str) -> str:
    normalized = _normalize_database_name(name)
    base_id = f"db-{normalized}" if normalized else f"db-{uuid4().hex[:8]}"

    existing_ids = {database.id for database in _databases}
    if base_id not in existing_ids:
        return base_id

    return f"{base_id}-{uuid4().hex[:4]}"


def get_databases() -> list[DatabaseRecord]:
    """Get all mock databases."""
    return _databases.copy()


def get_database(database_id: str) -> DatabaseRecord | None:
    """Get a single mock database by ID."""
    for db in _databases:
        if db.id == database_id:
            return db
    return None


def create_database(input_data: CreateDatabaseInput) -> DatabaseRecord:
    now = datetime.now()
    created = DatabaseRecord(
        id=_build_database_id(input_data.name),
        name=input_data.name,
        engine=input_data.engine,
        description=input_data.description,
        created_at=now,
        updated_at=now,
    )
    _databases.append(created)
    return created


def update_database(database_id: str, input_data: UpdateDatabaseInput) -> DatabaseRecord | None:
    for index, database in enumerate(_databases):
        if database.id != database_id:
            continue

        updated = database.model_copy(
            update={
                "name": input_data.name if input_data.name is not None else database.name,
                "engine": input_data.engine if input_data.engine is not None else database.engine,
                "description": (
                    input_data.description
                    if input_data.description is not None
                    else database.description
                ),
                "updated_at": datetime.now(),
            }
        )
        _databases[index] = updated
        return updated

    return None


def delete_database(database_id: str) -> bool:
    previous_length = len(_databases)
    _databases[:] = [database for database in _databases if database.id != database_id]
    return len(_databases) < previous_length
