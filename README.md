# DBTalkie

DBTalkie is a futuristic Text-to-SQL assistant with a cyberpunk-inspired UI.
Users connect SQL databases, ask questions in natural language, and receive results as streamed AI responses plus rich widgets (tables, charts, KPIs, and schema views).

## Project Structure

This repository is a full-stack monorepo:

- `client/`: React 19 + Vite + TypeScript frontend
- `server/`: FastAPI + Python 3.12 backend
- `scripts/`: SQL scripts for local/demo data bootstrap
- `docker-compose.yml`: local orchestration (frontend, backend, postgres, demo postgres)

## Core Features

- Natural language to SQL flow (mock-backed at this stage)
- Real-time assistant responses via SSE streaming
- Rich result widgets:
  - Text explanation
  - Table
  - Bar chart
  - Line chart
  - KPI card
  - Schema diagram
- Multi-database workspace with conversations scoped by database

## Tech Stack

### Frontend

- React 19
- TypeScript (strict)
- Vite
- TanStack Query
- Framer Motion
- ReactFlow
- ApexCharts

### Backend

- Python 3.12+
- FastAPI
- Uvicorn
- pydantic-settings
- sse-starlette
- uv (package/dependency manager)

## Environment Variables

Create a `.env` file in the repository root.

Use this template and replace placeholder values with your own:

```env
# PostgreSQL (main app DB)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
DB_HOST=postgres

# Backend app
APP_NAME=DBTalkie API
DEBUG=True
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Demo database (used by postgres-demo service)
DEMO_DB_HOST=postgres-demo
DEMO_DB_USER=your_demo_db_user
DEMO_DB_PASSWORD=your_demo_db_password
DEMO_DB_NAME=your_demo_db_name
DEMO_DB_PORT=5433
```

Notes:

- Do not commit real credentials or API keys.
- The backend loads variables from the root `.env` file.
- `DB_HOST=postgres` and `DEMO_DB_HOST=postgres-demo` are intended for Docker network usage.

## Run with Docker (Recommended)

From the repository root:

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Health check: http://localhost:8000/health
- PostgreSQL: mapped from `${DB_PORT}` to container `5432`
- Demo PostgreSQL: mapped from `${DEMO_DB_PORT}` to container `5432`

Stop all services:

```bash
docker compose down
```

## Run Locally (Without Docker)

### 1) Backend

```bash
cd server
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2) Frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173 by default.

## API Overview

- `GET /health`: health check
- `GET /databases`: list databases
- `POST /databases`: create database
- `GET /databases/{id}`: get database
- `PATCH /databases/{id}`: update database
- `DELETE /databases/{id}`: delete database
- `GET /chat/messages?databaseId=<id>`: get message history
- `POST /chat/stream`: stream assistant response (SSE)

## Screenshot

Add a product screenshot here:

```md
![DBTalkie screenshot](docs/screenshot.png)
```

(You can create a `docs/` folder in the root and store images there.)

## Notes for Development

- Keep frontend network calls inside `client/src/services/`.
- Keep backend business logic in service/controller layers.
- Keep SSE event contract aligned between frontend and backend.
