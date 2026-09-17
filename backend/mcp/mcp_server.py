"""MCP stdio server exposing incident tools to Claude Desktop via the REST API.

NOTE: the FastAPI backend (uvicorn app.main:app) must be running on http://localhost:8000
for these tools to work, since every tool below just calls the REST API.
"""

from typing import Optional

import httpx
from mcp.server.fastmcp import FastMCP

API_BASE_URL = "http://localhost:8000"

mcp = FastMCP("incident-management-tool")


@mcp.tool()
async def list_incidents() -> list[dict]:
    """List all incidents."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/incidents")
        response.raise_for_status()
        return response.json()


@mcp.tool()
async def get_incident(incident_id: int) -> dict:
    """Get a single incident by id."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/incidents/{incident_id}")
        response.raise_for_status()
        return response.json()


@mcp.tool()
async def search_incidents(
    severity: Optional[str] = None,
    team: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
) -> list[dict]:
    """Search incidents by severity (Low/Medium/High), team, status (Open/Mitigated/Resolved),
    and/or free-text q (matches incident number like INC101 or title)."""
    params = {
        k: v
        for k, v in {"severity": severity, "team": team, "status": status, "q": q}.items()
        if v
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/incidents", params=params)
        response.raise_for_status()
        return response.json()


@mcp.tool()
async def create_incident(
    title: str,
    description: str,
    start_time: str,
    severity: str,
    team: str,
    end_time: Optional[str] = None,
    root_cause: Optional[str] = None,
) -> dict:
    """Create a new incident. Times must be ISO 8601 strings."""
    payload = {
        "title": title,
        "description": description,
        "start_time": start_time,
        "end_time": end_time,
        "severity": severity,
        "team": team,
        "root_cause": root_cause,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BASE_URL}/incidents", json=payload)
        response.raise_for_status()
        return response.json()


if __name__ == "__main__":
    mcp.run(transport="stdio")
