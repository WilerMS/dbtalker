from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from app.models.database import (
    CreateDatabaseInput,
    DatabaseConnection,
    DatabaseEngine,
    DatabaseRecord,
    UpdateDatabaseInput,
)


def _icon_for_engine(engine: DatabaseEngine) -> str:
    if engine == "postgresql":
        return "Database"

    if engine == "mongodb":
        return "Leaf"

    return "HardDrive"


_databases: list[DatabaseRecord] = [
    DatabaseRecord(
        id="83d48401c6f4447283184ebd610148f5",
        name="PostgreSQL",
        engine="postgresql",
        icon="Database",
        description="Operational commerce data",
        connection=DatabaseConnection(
            host="postgres.dbtalkie.internal",
            port=5432,
            database="commerce",
            username="readonly",
            password="********",
            use_ssl=True,
        ),
        created_at=datetime(2026, 1, 10, 10, 0, 0),
        updated_at=datetime(2026, 1, 10, 10, 0, 0),
    ),
    DatabaseRecord(
        id="83d48401c6f4447283184ebd610148f6",
        name="MongoDB",
        engine="mongodb",
        icon="Leaf",
        description="Event stream and audit logs",
        connection=DatabaseConnection(
            host="mongo.dbtalkie.internal",
            port=27017,
            database="events",
            username="analytics",
            password="********",
            use_ssl=True,
        ),
        created_at=datetime(2026, 1, 12, 14, 0, 0),
        updated_at=datetime(2026, 1, 12, 14, 0, 0),
    ),
    DatabaseRecord(
        id="83d48401c6f4447283184ebd610148f7",
        name="SQLite",
        engine="sqlite",
        icon="HardDrive",
        description="Local analytics snapshot",
        connection=DatabaseConnection(
            host="localhost",
            port=0,
            database="analytics.db",
            username="local",
            password="********",
            use_ssl=False,
        ),
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
        icon=_icon_for_engine(input_data.engine),
        description=input_data.description,
        connection=DatabaseConnection(**input_data.connection.model_dump()),
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
                "icon": (
                    _icon_for_engine(input_data.engine)
                    if input_data.engine is not None
                    else database.icon
                ),
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
