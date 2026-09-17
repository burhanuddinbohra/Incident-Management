# Incident Management

Incident Management is a full-stack incident tracking application built with React, FastAPI, SQLAlchemy, and SQLite. It provides a simple workflow for creating, reviewing, filtering, updating, and deleting operational incidents.

## Features

- Create, edit, and delete incidents
- Track severity (`Low`, `Medium`, `High`), status (`Open`, `Mitigated`, `Resolved`), team, timestamps, descriptions, and root cause
- Automatically generated incident numbers such as `INC101`
- Search by incident number or title
- Filter by severity, team, and status
- Seeded sample incidents for a useful first run
- REST API documented automatically by FastAPI at `/docs`
- MCP stdio server with tools for listing, retrieving, searching, and creating incidents through the REST API

## Project Structure

```text
backend/
  app/
    controllers/    Business logic and database operations
    models/         SQLAlchemy ORM models
    routes/         FastAPI HTTP routes
    schemas/        Pydantic request and response schemas
    database.py     Async SQLite database setup
    main.py         FastAPI application entrypoint
  mcp/
    mcp_server.py   MCP tools for incident management
  requirements.txt
frontend/
  src/
    api/             The frontend's only backend API client
    components/      Filters, form, table, and row components
    models/          Shared frontend constants
    pages/           Page-level state and event handling
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer and npm
- Windows PowerShell or another terminal

## Run Locally

Clone the repository and enter the project directory:

```powershell
git clone https://github.com/<your-github-username>/Incident-Management.git
cd Incident-Management
```

### 1. Start the backend

Create and activate a virtual environment, then install the dependencies:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`. The first startup creates the local SQLite database and seeds sample incidents. Open `http://localhost:8000/docs` for the interactive API documentation.

Keep this terminal running.

### 2. Start the frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

For a production build:

```powershell
npm run lint
npm run build
```

### 3. Run the MCP server (optional)

The backend must already be running because the MCP server calls the REST API at `http://localhost:8000`.

From a third terminal:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python mcp\mcp_server.py
```

The server uses stdio transport and exposes these tools:

- `list_incidents`
- `get_incident`
- `search_incidents`
- `create_incident`

To connect it to Claude Desktop, copy `backend/mcp/claude_desktop_config.example.json` to Claude Desktop's configuration file and update the project path if necessary. Do not commit a personal Claude Desktop configuration containing local paths or secrets.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/incidents` | Create an incident |
| `GET` | `/incidents` | List or filter incidents |
| `GET` | `/incidents/{id}` | Get one incident |
| `PUT` | `/incidents/{id}` | Replace an incident |
| `DELETE` | `/incidents/{id}` | Delete an incident |

List filters are optional query parameters: `severity`, `team`, `status`, and `q`.

## GitHub Publishing

Create a **public** repository named `Incident-Management` on GitHub, then run these commands from the project root:

```powershell
git init
git add .
git status
git commit -m "Initial incident management application"
git branch -M main
git remote add origin https://github.com/<your-github-username>/Incident-Management.git
git push -u origin main
```

The `.gitignore` excludes virtual environments, installed packages, local SQLite databases, build output, caches, logs, and environment files. The backend application source, MCP server, dependency manifests, and frontend source remain available to GitHub.

## Architecture

The React page owns UI state and calls `frontend/src/api/incidentApi.js`. FastAPI routes delegate to async controller functions, which use SQLAlchemy models and Pydantic schemas against SQLite. The MCP server is a separate stdio adapter that calls the same REST API, so it shares the application's normal validation and business behavior.