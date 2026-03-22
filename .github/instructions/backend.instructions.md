---
applyTo: "server/**"
---

# DBTalker — Backend Instructions

These rules apply to **all files under `server/`**. Read them in full before writing or modifying any backend code. For the overall project context, flow, and SSE contract, refer to [`copilot-instructions.md`](../copilot-instructions.md).

---

## Tech Stack

| Concern         | Library / Tool                |
| --------------- | ----------------------------- |
| Language        | Python 3.12+                  |
| Framework       | FastAPI                       |
| Package manager | `uv` (NOT pip, NOT poetry)    |
| ASGI server     | Uvicorn (`uvicorn[standard]`) |
| SSE streaming   | `sse-starlette`               |
| Data validation | Pydantic v2                   |

To add a dependency: `uv add <package>`. To run the server: `uv run python main.py` from `server/`.

---

## Hard Rules

- **NEVER** use bare `dict` without a Pydantic model or `TypedDict` for request/response bodies.
- **NEVER** use `Any` from `typing`. Every function must have full type hints.
- **NEVER** use `requests` or `httpx` for outgoing calls in application code (only in tests).
- **ALWAYS** use Pydantic models for all API request bodies and response shapes.
- **ALWAYS** define type hints on every function signature (parameters and return type).

---

## Project Structure

Follow this layout. Do not create new top-level directories under `app/` without a clear reason.

```
server/
  main.py              # Entry point — starts uvicorn
  pyproject.toml       # uv-managed dependencies
  app/
    main.py            # FastAPI app factory, CORS, router registration
    api/
      router.py        # Aggregates all sub-routers (include_router)
      routes/
        health.py      # GET /health
        databases.py   # CRUD for registered databases
        chat.py        # SSE streaming endpoint for chat
```

Each resource lives in its own file under `routes/`. Never put multiple unrelated resources in the same route file.

---

## CORS Configuration

The frontend runs on `http://localhost:5173` in development. Configure CORS in `app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## REST Endpoints (Database Management)

Implement the following endpoints under the `/databases` prefix:

| Method   | Path              | Description                   |
| -------- | ----------------- | ----------------------------- |
| `GET`    | `/databases`      | List all registered databases |
| `POST`   | `/databases`      | Register a new database       |
| `GET`    | `/databases/{id}` | Get a single database by ID   |
| `PATCH`  | `/databases/{id}` | Update a database             |
| `DELETE` | `/databases/{id}` | Delete a database             |

Use Pydantic models for all request and response schemas. Mirror the TypeScript types from the client:

```python
from pydantic import BaseModel
from typing import Literal
from datetime import datetime

DatabaseEngine = Literal["postgresql", "mongodb", "sqlite"]

class DatabaseRecord(BaseModel):
    id: str
    name: str
    engine: DatabaseEngine
    description: str | None = None
    created_at: datetime
    updated_at: datetime

class CreateDatabaseInput(BaseModel):
    name: str
    engine: DatabaseEngine
    description: str | None = None

class UpdateDatabaseInput(BaseModel):
    name: str | None = None
    engine: DatabaseEngine | None = None
    description: str | None = None
```

---

## SSE Endpoint (Chat Streaming)

The chat endpoint must implement the same **SSE chunk sequence** as the client-side mock. The chunk format is the binding contract between client and server — it must not diverge.

### Endpoint

```
GET /chat/stream?query=<string>&database_id=<string>
```

Returns an SSE stream using `sse-starlette`'s `EventSourceResponse`.

### Chunk Sequence

Every response follows this exact sequence:

```
# 1. Signal that a response is starting (drives skeleton in client)
event: message
data: {"event": "incoming", "type": "<MessageType>"}

# 2. Send the full data payload (replaces skeleton with real widget/text)
event: message
data: {"event": "data", "type": "<MessageType>", "data": <MessageData>}

# 3. Signal completion
event: message
data: {"event": "finished"}
```

A single query may emit **two sequences** (text first, then optionally a widget), with `finished` sent only once at the end — identical to how `chatService.mock.ts` behaves.

### MessageType values

`"text" | "schema" | "kpi" | "bar" | "line" | "table"`

### Pydantic models for chunks

```python
from typing import Literal, Union
from pydantic import BaseModel

class SSEChunkIncoming(BaseModel):
    event: Literal["incoming"]
    type: str

class SSEChunkData(BaseModel):
    event: Literal["data"]
    type: str
    data: dict  # typed further per MessageType

class SSEChunkFinished(BaseModel):
    event: Literal["finished"]

SSEChunk = Union[SSEChunkIncoming, SSEChunkData, SSEChunkFinished]
```

---

## Current Phase: Mock Data

**The backend is currently in the mock phase.** There is no real database connection and no AI/LLM integration yet. The server must return the same mocked data that currently lives in the client's `chatMockData.ts`.

Specifically:

- `GET /databases` returns a static in-memory list of databases (PostgreSQL, MongoDB, SQLite).
- `GET /chat/stream` streams mocked SSE chunks — a text message followed by a widget — using the same keyword-based detection logic as the client mock (keywords: `schema`, `kpi`, `revenue`, `trend`, `line`, `bar`, `table`).
- Simulate realistic latency with `asyncio.sleep()` between chunks (900 ms before first chunk, 700 ms before data, 500 ms before widget chunk, etc.) to match the client mock timing.

Do **not** implement LLM calls, real database connections, or query execution yet. That comes in a later phase.

---

## Typing & Code Conventions

- **snake_case** for all Python identifiers (variables, functions, modules, Pydantic fields).
- Use `from __future__ import annotations` at the top of files for deferred evaluation of type hints.
- Use Pydantic `BaseModel` for all wire types. Use `TypedDict` for internal data structures that are not serialized.
- Never import `Any` from `typing`. If a type is unknown, model it properly.
- Async functions are preferred for route handlers (`async def`). Use `await asyncio.sleep()` for latency simulation, never `time.sleep()`.
- Use Python's built-in `uuid` module (`uuid.uuid4()`) for ID generation, not third-party libraries.

---

## Error Handling

- Return proper HTTP status codes: `404` for not found, `422` is handled automatically by Pydantic, `500` for unexpected errors.
- Use FastAPI's `HTTPException` for expected error responses.
- Do not catch and swallow exceptions silently.
