from collections.abc import AsyncGenerator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.models.domain import Base, Database

DATABASE_URL = settings.database_url

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def seed_db() -> None:
    """Insert a default database row only when the table is empty."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Database.id).limit(1))
        has_data = result.scalar_one_or_none() is not None
        if has_data:
            return

        default_database = Database(
            id="83d48401c6f4447283184ebd610148f5",
            name="Base de Datos de Prueba",
            engine="postgresql",
            icon="Database",
            description="Seed inicial para pruebas locales",
            connection_data={
                "host": "postgres",
                "port": 5432,
                "user": "dbtalkie",
                "password": "dbtalkie",
                "database": "dbtalkie",
            },
        )

        session.add(default_database)
        await session.commit()
