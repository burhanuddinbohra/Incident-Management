"""Database setup: async engine, session factory, and declarative base."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# SQLite file lives alongside the app; aiosqlite driver gives us async access.
DATABASE_URL = "sqlite+aiosqlite:///./incidents.db"

engine = create_async_engine(DATABASE_URL, echo=False)

# expire_on_commit=False lets us keep using ORM objects after commit (e.g. to return them in a response)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    """Base class every ORM model inherits from."""
    pass


async def get_db():
    """FastAPI dependency that yields a DB session and closes it afterwards."""
    async with async_session() as session:
        yield session
