from collections.abc import AsyncGenerator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.models.domain import Base, Database

engine = create_async_engine(settings.database_url, echo=True)

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
            id=settings.demo_db_id,
            name="Demo E-commerce DB",
            engine="postgresql",
            icon="Database",
            user_id=settings.demo_user_id,
            description="Initial demo database with sample e-commerce data.",
            connection_data={
                "host": settings.db_host,
                "port": settings.db_port,
                "user": settings.db_user,
                "password": settings.db_password,
                "database": settings.demo_db_name,
            },
        )

        session.add(default_database)
        await session.commit()
