"""
Database controller for orchestrating database operations.
Delegates business logic to DatabaseService.
Handles HTTP-level concerns (HTTPException, status codes).
"""

from __future__ import annotations

from app.models.database import (
    CreateDatabaseInput,
    DatabaseRecord,
    UpdateDatabaseInput,
)
from app.services.database_service import DatabaseService
from app.utility.errors import ResourceNotFoundError


class DatabaseController:
    """
    Controller for database operations.
    Injects DatabaseService and delegates all business logic.
    Returns domain objects; HTTP mapping happens in routes.
    """

    def __init__(self, database_service: DatabaseService) -> None:
        """Initialize DatabaseController with injected services."""
        self._service = database_service

    def list_databases(self) -> list[DatabaseRecord]:
        """
        List all registered databases.

        Returns:
            List of all database records.
        """
        return self._service.get_all_databases()

    def get_database(self, database_id: str) -> DatabaseRecord:
        """
        Get a single database by ID.

        Args:
            database_id: The ID of the database to retrieve.

        Returns:
            DatabaseRecord.
        """
        database = self._service.get_database_by_id(database_id)
        if not database:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return database

    def create_database(self, input_data: CreateDatabaseInput) -> DatabaseRecord:
        """
        Create a new database record.

        Args:
            input_data: Input model with name, engine, description.

        Returns:
            The newly created DatabaseRecord.
        """
        return self._service.create_database(input_data)

    def update_database(
        self,
        database_id: str,
        input_data: UpdateDatabaseInput,
    ) -> DatabaseRecord:
        """
        Update an existing database record.

        Args:
            database_id: The ID of the database to update.
            input_data: Partial update model.

        Returns:
            Updated DatabaseRecord.
        """
        updated = self._service.update_database(database_id, input_data)
        if not updated:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return updated

    def delete_database(self, database_id: str) -> bool:
        """
        Delete a database record.

        Args:
            database_id: The ID of the database to delete.

        Returns:
            True when delete succeeds.
        """
        was_deleted = self._service.delete_database(database_id)
        if not was_deleted:
            raise ResourceNotFoundError(f"Database '{database_id}' not found.")
        return True
