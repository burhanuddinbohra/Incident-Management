"""ORM model for an incident (maps to the 'incidents' table)."""

from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    # Human-friendly identifier (e.g. INC101). Nullable at the DB level because it's
    # only assigned after flush, once the id is known — always set by the time it's returned.
    incident_number: Mapped[str | None] = mapped_column(String(20), unique=True, index=True, nullable=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    severity: Mapped[str] = mapped_column(String(20))
    team: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="Open")
    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
