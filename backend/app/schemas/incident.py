"""Pydantic schemas: validation for requests (Create/Update) and shape of responses (Out)."""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

Severity = Literal["Low", "Medium", "High"]
Status = Literal["Open", "Mitigated", "Resolved"]


class IncidentBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: Optional[datetime] = None
    severity: Severity
    team: str
    root_cause: Optional[str] = None


class IncidentCreate(IncidentBase):
    """Fields required to create a new incident. incident_number/status are set by the server."""
    pass


class IncidentUpdate(IncidentBase):
    """Fields required to update an incident (full replace via PUT)."""
    status: Status


class IncidentOut(IncidentBase):
    """Shape returned to the frontend, includes the DB-generated id and incident_number."""
    id: int
    incident_number: str
    status: Status

    # Lets Pydantic read attributes straight off the SQLAlchemy ORM object.
    model_config = ConfigDict(from_attributes=True)
