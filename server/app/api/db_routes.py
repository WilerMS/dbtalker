from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.dependencies import db_controller
from app.controllers.db_controller import DatabaseController
from app.core.security import get_user_id
from app.schemas.database import (
    CreateDatabaseInput,
    DatabaseResponseRecord,
    UpdateDatabaseInput,
)

router = APIRouter(prefix="/databases", tags=["Databases"])


@router.get("/", response_model=list[DatabaseResponseRecord])
async def list_databases(
    database_controller: DatabaseController = Depends(db_controller),
    user_id: str = Depends(get_user_id),
) -> list[DatabaseResponseRecord]:
    return await database_controller.list_databases(user_id)


@router.get("/demo", response_model=DatabaseResponseRecord)
async def get_demo_database(
    database_controller: DatabaseController = Depends(db_controller),
) -> DatabaseResponseRecord:
    return await database_controller.get_demo_database()


@router.get("/{database_id}", response_model=DatabaseResponseRecord)
async def get_database_by_id(
    database_id: str,
    database_controller: DatabaseController = Depends(db_controller),
    user_id: str = Depends(get_user_id),
) -> DatabaseResponseRecord:
    return await database_controller.get_database(database_id, user_id)


@router.post(
    "/",
    response_model=DatabaseResponseRecord,
    status_code=status.HTTP_201_CREATED,
)
async def create_database_endpoint(
    input_data: CreateDatabaseInput,
    database_controller: DatabaseController = Depends(db_controller),
    user_id: str = Depends(get_user_id),
) -> DatabaseResponseRecord:
    return await database_controller.create_database(input_data, user_id)


@router.patch("/{database_id}", response_model=DatabaseResponseRecord)
async def update_database_endpoint(
    database_id: str,
    input_data: UpdateDatabaseInput,
    database_controller: DatabaseController = Depends(db_controller),
    user_id: str = Depends(get_user_id),
) -> DatabaseResponseRecord:
    return await database_controller.update_database(database_id, input_data, user_id)


@router.delete("/{database_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_database_endpoint(
    database_id: str,
    database_controller: DatabaseController = Depends(db_controller),
    user_id: str = Depends(get_user_id),
) -> None:
    await database_controller.delete_database(database_id, user_id)
