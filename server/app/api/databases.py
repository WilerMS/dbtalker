from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.mocks.databases import get_database, get_databases
from app.models.database import DatabaseRecord

router = APIRouter(prefix="/databases", tags=["databases"])


@router.get("/", response_model=list[DatabaseRecord])
async def list_databases() -> list[DatabaseRecord]:
    return get_databases()


@router.get("/{database_id}", response_model=DatabaseRecord)
async def get_database_by_id(database_id: str) -> DatabaseRecord:
    db = get_database(database_id)
    if not db:
        raise HTTPException(
            status_code=404,
            detail=f"Database '{database_id}' not found.",
        )
    return db
