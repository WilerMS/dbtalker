from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.models.domain import Database

DatabaseEngine = Literal["postgresql"]


class DatabaseConnection(BaseModel):
    """Stored database connection details (server-side only)."""

    host: str
    port: int
    database: str
    username: str
    password: str
    use_ssl: bool


class DatabaseConnectionInput(BaseModel):
    """Request connection details for creating a database."""

    host: str
    port: int = Field(gt=0)
    database: str
    username: str
    password: str
    use_ssl: bool


class DatabaseRecord(BaseModel):
    """Represents a registered database with server-side connection data."""

    id: str
    name: str
    engine: DatabaseEngine
    icon: str
    description: str | None = None
    connection: DatabaseConnection
    created_at: datetime
    updated_at: datetime


class DatabaseResponseRecord(BaseModel):
    """Represents public database metadata returned to the frontend."""

    id: str
    name: str
    engine: DatabaseEngine
    icon: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_database(
        cls,
        database: "Database",
    ) -> "DatabaseResponseRecord":
        return cls(
            id=database.id,
            name=database.name,
            engine=database.engine,
            icon=database.icon,
            description=database.description,
            created_at=database.created_at,
            updated_at=database.updated_at,
        )


class CreateDatabaseInput(BaseModel):
    """Request body for creating a new database."""

    name: str
    engine: DatabaseEngine
    icon: str | None = None
    description: str | None = None
    connection: DatabaseConnectionInput


class UpdateDatabaseInput(BaseModel):
    """Request body for updating a database."""

    name: str | None = None
    icon: str | None = None
    engine: DatabaseEngine | None = None
    description: str | None = None
