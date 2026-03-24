from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from app.models.database import ConversationRecord

_conversations: list[ConversationRecord] = [
    # PostgreSQL conversations
    ConversationRecord(
        id="conv-db-postgres-overview",
        database_id="db-postgres",
        title="Resumen general de PostgreSQL",
        created_at=datetime(2026, 1, 15, 10, 0, 0),
        updated_at=datetime(2026, 1, 15, 10, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-postgres-weekly-kpi",
        database_id="db-postgres",
        title="KPIs semanales (PostgreSQL)",
        created_at=datetime(2026, 1, 16, 14, 0, 0),
        updated_at=datetime(2026, 1, 16, 14, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-postgres-schema-check",
        database_id="db-postgres",
        title="Revision de esquema y relaciones",
        created_at=datetime(2026, 1, 17, 9, 0, 0),
        updated_at=datetime(2026, 1, 17, 9, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-postgres-sales-breakdown",
        database_id="db-postgres",
        title="Analisis de ventas por categoria",
        created_at=datetime(2026, 1, 18, 15, 30, 0),
        updated_at=datetime(2026, 1, 18, 15, 30, 0),
    ),
    # MongoDB conversations
    ConversationRecord(
        id="conv-db-mongodb-events-overview",
        database_id="db-mongodb",
        title="Resumen de eventos y logs",
        created_at=datetime(2026, 1, 15, 11, 0, 0),
        updated_at=datetime(2026, 1, 15, 11, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-mongodb-audit-analysis",
        database_id="db-mongodb",
        title="Analisis de auditor'ia y seguridad",
        created_at=datetime(2026, 1, 16, 16, 0, 0),
        updated_at=datetime(2026, 1, 16, 16, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-mongodb-performance-check",
        database_id="db-mongodb",
        title="Rendimiento y optimizacion",
        created_at=datetime(2026, 1, 17, 10, 30, 0),
        updated_at=datetime(2026, 1, 17, 10, 30, 0),
    ),
    # SQLite conversations
    ConversationRecord(
        id="conv-db-sqlite-snapshot-overview",
        database_id="db-sqlite",
        title="Resumen de snapshot local",
        created_at=datetime(2026, 1, 15, 12, 0, 0),
        updated_at=datetime(2026, 1, 15, 12, 0, 0),
    ),
    ConversationRecord(
        id="conv-db-sqlite-analytics",
        database_id="db-sqlite",
        title="Analisis y estadisticas",
        created_at=datetime(2026, 1, 17, 11, 0, 0),
        updated_at=datetime(2026, 1, 17, 11, 0, 0),
    ),
]


def get_conversations_by_database(database_id: str) -> list[ConversationRecord]:
    """Get all conversations for a specific database."""
    return [conv for conv in _conversations if conv.database_id == database_id]


def create_conversation(database_id: str, title: str) -> ConversationRecord:
    """Create and persist a new conversation for a database."""
    now = datetime.now()
    new_conv = ConversationRecord(
        id=f"conv-{uuid4().hex[:12]}",
        database_id=database_id,
        title=title,
        created_at=now,
        updated_at=now,
    )
    _conversations.append(new_conv)
    return new_conv
