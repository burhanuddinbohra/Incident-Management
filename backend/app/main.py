"""FastAPI app entrypoint: wires up CORS, DB startup/seed, and routes."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.incident_controllers import seed_incidents
from app.database import async_session, engine, Base
from app.routes.incident_routes import router as incident_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and seed sample data once on startup.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        await seed_incidents(db)
    yield


app = FastAPI(title="Incident Management API", lifespan=lifespan)

# Allow the Vite dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incident_router)
