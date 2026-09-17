"""Business logic for incidents: async CRUD + filtering. No HTTP concerns here."""

from typing import Optional, Sequence

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate


async def create_incident(db: AsyncSession, data: IncidentCreate) -> Incident:
    incident = Incident(**data.model_dump(), status="Open")
    db.add(incident)
    # Flush first so the DB assigns an id, which we use to build the incident number.
    await db.flush()
    incident.incident_number = f"INC{100 + incident.id}"
    await db.commit()
    await db.refresh(incident)
    return incident


async def get_incidents(
    db: AsyncSession,
    severity: Optional[str] = None,
    team: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
) -> Sequence[Incident]:
    query = select(Incident)
    # Apply optional filters only when provided in the query string.
    if severity:
        query = query.where(Incident.severity == severity)
    if team:
        query = query.where(Incident.team == team)
    if status:
        query = query.where(Incident.status == status)
    if q:
        # Free-text search matches either the incident number or the title.
        term = f"%{q}%"
        query = query.where(or_(Incident.incident_number.ilike(term), Incident.title.ilike(term)))
    result = await db.execute(query)
    return result.scalars().all()


async def get_incident(db: AsyncSession, incident_id: int) -> Optional[Incident]:
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    return result.scalar_one_or_none()


async def update_incident(
    db: AsyncSession, incident: Incident, data: IncidentUpdate
) -> Incident:
    for field, value in data.model_dump().items():
        setattr(incident, field, value)
    await db.commit()
    await db.refresh(incident)
    return incident


async def delete_incident(db: AsyncSession, incident: Incident) -> None:
    await db.delete(incident)
    await db.commit()


async def count_incidents(db: AsyncSession) -> int:
    result = await db.execute(select(Incident))
    return len(result.scalars().all())


async def seed_incidents(db: AsyncSession) -> None:
    """Insert realistic sample incidents if the table is empty (called on startup)."""
    if await count_incidents(db) > 0:
        return

    from datetime import datetime

    samples = [
        Incident(
            title="Payment gateway timeout",
            description="Customers unable to complete checkout due to gateway timeouts.",
            start_time=datetime(2026, 1, 10, 9, 15),
            end_time=datetime(2026, 1, 10, 11, 0),
            severity="High",
            team="CIB Tech",
            status="Resolved",
            root_cause="Upstream provider certificate expired.",
        ),
        Incident(
            title="Market data feed delay",
            description="Delayed pricing updates on the trading dashboard.",
            start_time=datetime(2026, 2, 3, 14, 30),
            end_time=datetime(2026, 2, 3, 15, 5),
            severity="Medium",
            team="Markets Tech",
            status="Resolved",
            root_cause="Network congestion on primary feed link.",
        ),
        Incident(
            title="Customer reference data mismatch",
            description="Duplicate customer records found after nightly sync.",
            start_time=datetime(2026, 3, 21, 2, 0),
            end_time=None,
            severity="Low",
            team="Ref Data",
            status="Open",
            root_cause=None,
        ),
        Incident(
            title="Mobile banking login outage",
            description="Users unable to log into the mobile banking app.",
            start_time=datetime(2026, 4, 5, 8, 0),
            end_time=datetime(2026, 4, 5, 9, 45),
            severity="High",
            team="CCB Tech",
            status="Resolved",
            root_cause="Auth service pod crash-looping after deployment.",
        ),
        Incident(
            title="Internal wiki unavailable",
            description="Confluence-like internal docs site returning 502 errors.",
            start_time=datetime(2026, 5, 17, 13, 10),
            end_time=datetime(2026, 5, 17, 13, 40),
            severity="Low",
            team="Other",
            status="Resolved",
            root_cause="Load balancer misconfiguration after maintenance window.",
        ),
        Incident(
            title="Trade settlement batch failure",
            description="Overnight settlement batch job failed for a subset of trades.",
            start_time=datetime(2026, 6, 2, 1, 30),
            end_time=None,
            severity="High",
            team="Markets Tech",
            status="Mitigated",
            root_cause="Downstream ledger service returned malformed responses.",
        ),
        Incident(
            title="Credit card fraud alert delay",
            description="Fraud alerts were delivered to analysts several minutes late.",
            start_time=datetime(2026, 6, 20, 16, 0),
            end_time=datetime(2026, 6, 20, 17, 15),
            severity="Medium",
            team="CCB Tech",
            status="Resolved",
            root_cause="Message queue backlog during peak traffic.",
        ),
        Incident(
            title="API gateway rate limiting misconfigured",
            description="Legitimate client requests were being throttled incorrectly.",
            start_time=datetime(2026, 7, 8, 10, 5),
            end_time=None,
            severity="Medium",
            team="CIB Tech",
            status="Mitigated",
            root_cause=None,
        ),
        Incident(
            title="Client onboarding form data loss",
            description="Some submitted onboarding forms were not persisted to the database.",
            start_time=datetime(2026, 7, 22, 12, 0),
            end_time=datetime(2026, 7, 22, 14, 30),
            severity="High",
            team="Ref Data",
            status="Resolved",
            root_cause="Unhandled exception during a schema migration.",
        ),
        Incident(
            title="VPN access outage for remote staff",
            description="Remote employees were unable to connect to the corporate VPN.",
            start_time=datetime(2026, 8, 1, 7, 45),
            end_time=datetime(2026, 8, 1, 9, 0),
            severity="Medium",
            team="Other",
            status="Resolved",
            root_cause="Expired VPN concentrator certificate.",
        ),
        Incident(
            title="Report generation service timeout",
            description="Monthly compliance reports failed to generate within the SLA window.",
            start_time=datetime(2026, 8, 15, 3, 0),
            end_time=None,
            severity="Low",
            team="Ref Data",
            status="Open",
            root_cause=None,
        ),
        Incident(
            title="Trading dashboard UI freeze",
            description="Traders reported the dashboard becoming unresponsive under heavy load.",
            start_time=datetime(2026, 8, 29, 9, 30),
            end_time=None,
            severity="High",
            team="Markets Tech",
            status="Open",
            root_cause=None,
        ),
    ]
    db.add_all(samples)
    # Flush to get ids assigned before we build the human-friendly incident numbers.
    await db.flush()
    for incident in samples:
        incident.incident_number = f"INC{100 + incident.id}"
    await db.commit()
