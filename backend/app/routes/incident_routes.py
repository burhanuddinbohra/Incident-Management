"""Thin HTTP layer: routes call the controller and translate results to responses."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import incident_controllers as crud
from app.database import get_db
from app.schemas.incident import IncidentCreate, IncidentOut, IncidentUpdate

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.post("", response_model=IncidentOut)
async def create_incident(data: IncidentCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_incident(db, data)


@router.get("", response_model=list[IncidentOut])
async def list_incidents(
    severity: Optional[str] = None,
    team: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_incidents(db, severity, team, status, q)


@router.get("/{incident_id}", response_model=IncidentOut)
async def get_incident(incident_id: int, db: AsyncSession = Depends(get_db)):
    incident = await crud.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.put("/{incident_id}", response_model=IncidentOut)
async def update_incident(
    incident_id: int, data: IncidentUpdate, db: AsyncSession = Depends(get_db)
):
    incident = await crud.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return await crud.update_incident(db, incident, data)


@router.delete("/{incident_id}", status_code=204)
async def delete_incident(incident_id: int, db: AsyncSession = Depends(get_db)):
    incident = await crud.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    await crud.delete_incident(db, incident)
