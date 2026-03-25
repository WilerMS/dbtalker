---
applyTo: "server/**"
---

# DBTalkie — Backend Instructions

These rules apply to all files under `server/`. Read them before modifying backend code. For full application context, client/server flow, and the shared SSE contract, refer to [`copilot-instructions.md`](../copilot-instructions.md).

---

## Tech Stack

| Concern         | Library / Tool      |
| --------------- | ------------------- |
| Language        | Python 3.12+        |
| Framework       | FastAPI             |
| Package manager | `uv`                |
| ASGI server     | `uvicorn[standard]` |
| SSE streaming   | `sse-starlette`     |
| Data validation | Pydantic v2         |

Use `uv add <package>` to add dependencies. Do not use `pip` or `poetry` for project dependency management.

---

## Hard Rules

- NEVER use `Any` from `typing`.
- ALWAYS add full type hints to every function signature.
- ALWAYS use Pydantic models for request and response bodies.
- NEVER put business logic directly in FastAPI route handlers.
- NEVER let controllers import mock modules directly.
- NEVER let routes import mock modules directly.
- ALWAYS keep the SSE contract identical to the client contract.
- ALWAYS keep backend identifiers in `snake_case`.
- ALWAYS use `asyncio.sleep()` for simulated latency, never `time.sleep()`.
- ALWAYS use Python's built-in `uuid` utilities for generated IDs.

---

## Backend Architecture

The backend follows a layered architecture:

```
server/
    pyproject.toml
    app/
        main.py                # FastAPI app setup, middleware, router registration
        api/
            router.py            # Aggregates all route modules
            routes/              # Preferred location for FastAPI route modules
                health.py
                databases.py
                chat.py
        controllers/           # Orchestration layer, no business logic
            database_controller.py
            conversation_controller.py
            chat_controller.py
        services/              # Business logic and data access abstraction
            base_service.py
            database_service.py
            conversation_service.py
            chat_service.py
        models/                # Pydantic wire models and shared domain models
            database.py
        mocks/                 # Mock data sources for the current phase
            databases.py
            conversations.py
            chat_data.py
```

### Layer Responsibilities

#### Routes

- Define FastAPI endpoints, parameters, response models, and status codes.
- Translate service/controller results into HTTP responses.
- Import controllers, not mocks.
- Stay thin.

#### Controllers

- Orchestrate use cases.
- Validate cross-resource context when needed.
- Coordinate one or more services.
- Remain HTTP-agnostic when practical.

#### Services

- Encapsulate business logic.
- Encapsulate data access.
- Use POO. Services should be classes, not loose helper functions.
- For the current mock phase, services may import from `app.mocks.*`.
- Be the only layer allowed to know where data comes from.

#### Mocks

- Represent the temporary persistence layer.
- Are implementation details of services.
- Must not leak into routes or controllers.

---

## Dependency Direction

Dependencies should flow in one direction only:

```
routes -> controllers -> services -> mocks
routes -> models
controllers -> models
services -> models
```

Avoid reversing this flow. In particular:

- `app/api/**` must not import `app.mocks/**`.
- `app/controllers/**` must not import `app.mocks/**`.
- `app/services/**` may import `app.mocks/**` during the mock phase.

---

## Current Phase: Mock-Backed Services

The backend is still in the mock phase. There is no real database connection and no LLM integration yet.

Current standard:

- Services expose stable interfaces.
- Services currently read and write in-memory mock data.
- Replacing mocks with real repositories later should require changes primarily inside services.
- Controllers and routes should not need major changes during that migration.

Do not add real DB drivers, ORM logic, external AI calls, or query execution in this phase unless the task explicitly requires it.

---

## Route Standards

- Prefer placing route modules in `app/api/routes/`.
- Keep one resource per route file.
- Route handlers should be `async def`.
- Use `HTTPException` for expected failures.
- Return `404` for missing resources.
- Let Pydantic/FastAPI handle `422` validation failures automatically.
- Do not swallow unexpected exceptions.

If legacy route files still exist directly under `app/api/`, do not add new business logic there. Move new work toward the layered structure and keep `app/api/router.py` aligned with the modules that are actually registered.

---

## Controller Standards

- Controllers should be small orchestration classes.
- A controller may coordinate multiple services.
- A controller should not contain persistence details.
- A controller should not build mock payloads directly.
- A controller should avoid framework-specific concerns unless there is a clear reason.

Examples of acceptable controller work:

- verifying that a `conversation_id` belongs to a `database_id`
- coordinating a database service and conversation service in the same use case
- delegating stream generation to `ChatService`

Examples of unacceptable controller work:

- direct imports from `app.mocks.chat_data`
- manual construction of mock database lists
- embedding SQL or repository code

---

## Service Standards

- Services must be class-based.
- Keep service APIs explicit and domain-oriented.
- Return domain objects or `None`/`bool` where appropriate.
- Do not raise HTTP-specific errors from services unless there is a strong project-wide pattern requiring it.
- Keep transport details out of services, except where a service is explicitly responsible for constructing stream payloads.

Recommended style:

```python
class DatabaseService(BaseService):
        def get_all_databases(self) -> list[DatabaseRecord]:
                ...

        def get_database_by_id(self, database_id: str) -> DatabaseRecord | None:
                ...
```

For chat streaming, a service may return an `AsyncGenerator[...]` when the service itself owns the response sequencing logic.

---

## Models and Typing

Keep wire models in Pydantic and centralize shared shapes in `app/models/`.

Current shared backend models include:

- `DatabaseRecord`
- `CreateDatabaseInput`
- `UpdateDatabaseInput`
- `ConversationRecord`
- `CreateConversationInput`
- `PendingMessage`
- `CompleteMessage`
- `UserMessage`
- `SSEChunkIncoming`
- `SSEChunkData`
- `SSEChunkFinished`
- `ChatRequestBody`

Typing rules:

- Use `from __future__ import annotations`.
- Prefer `Literal` for constrained string fields.
- Prefer unions of explicit Pydantic models for polymorphic payloads.
- Avoid loose `dict` shapes for public contracts unless the schema is genuinely dynamic.
- If a structure is internal-only and not serialized, `TypedDict` is acceptable.

---

## CORS Configuration

The frontend runs on `http://localhost:5173` in development.

Preferred configuration:

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

Do not default to `allow_origins=["*"]` unless the task explicitly requires permissive local development behavior.

---

## Active Endpoints

These are the backend endpoints that the instructions must reflect.

### Health

| Method | Path      | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

### Databases

| Method   | Path                       | Description                   |
| -------- | -------------------------- | ----------------------------- |
| `GET`    | `/databases/`              | List all registered databases |
| `POST`   | `/databases/`              | Create a new database         |
| `GET`    | `/databases/{database_id}` | Get one database by ID        |
| `PATCH`  | `/databases/{database_id}` | Update one database           |
| `DELETE` | `/databases/{database_id}` | Delete one database           |

### Conversations

| Method | Path                                     | Description                          |
| ------ | ---------------------------------------- | ------------------------------------ |
| `GET`  | `/databases/{database_id}/conversations` | List conversations for a database    |
| `POST` | `/databases/{database_id}/conversations` | Create a conversation for a database |

### Chat

| Method | Path                                                   | Description                               |
| ------ | ------------------------------------------------------ | ----------------------------------------- |
| `GET`  | `/chat/messages?database_id=<id>&conversation_id=<id>` | Get message history for a conversation    |
| `POST` | `/chat/stream`                                         | Start SSE chat stream from a request body |

`POST /chat/stream` must receive a JSON body with this shape:

```python
class UserMessage(CompleteMessage):
    role: Literal["user"]
    type: Literal["text"]
    status: Literal["complete"] = "complete"
    data: TextData


class ChatRequestBody(BaseModel):
    message: UserMessage
    database_id: str
    conversation_id: str
```

---

## Chat Streaming Contract

The SSE contract is binding. Do not change it on the backend without changing the client.

### Event Envelope

Each SSE event must be emitted as:

```text
event: message
data: <json>
```

### Payload Sequence

Every streamed response must follow this order:

```text
1. incoming
2. data
3. optional incoming for widget
4. optional data for widget
5. optional incoming for closing text
6. optional data for closing text
7. finished
```

### Required Chunk Models

```python
class SSEChunkIncoming(BaseModel):
    id: str
        event: Literal["incoming"]
        type: MessageType

class SSEChunkData(BaseModel):
    id: str
        event: Literal["data"]
        type: MessageType
        data: MessageData

class SSEChunkFinished(BaseModel):
        event: Literal["finished"]
```

### MessageType Values

`"text" | "schema" | "kpi" | "bar" | "line" | "table"`

### Timing Rules

To match the current mock behavior:

- wait `0.9s` before the first `incoming`
- wait `0.7s` before the first text `data`
- if a widget exists, wait `0.5s` before widget `incoming`
- wait `0.5s` before widget `data`
- wait `0.5s` before closing text `incoming`
- wait `0.7s` before closing text `data`
- wait `0.2s` before `finished`

### Chunk Identity Rules

- every `incoming`/`data` pair must share the same UUID
- the persisted bot message for that pair must reuse that same UUID
- `finished` does not carry an id

---

## Chat Behavior Rules

The current backend chat behavior is mock-driven and keyword-based.

Maintain these rules unless the task explicitly changes them:

- chat responses are scoped to `conversation_id`
- widget detection is keyword-based
- a query may yield text only, or text plus widget plus closing text
- user and bot messages are persisted to the mock conversation history
- the persisted user message must reuse the exact `message.id` and `message.timestamp` received from the frontend
- stream generation should stay deterministic and client-compatible

Current keyword families include terms such as:

- `schema`
- `kpi`
- `revenue`
- `ingresos`
- `trend`
- `line`
- `bar`
- `table`

---

## Error Handling

- Use `404` when a database or conversation does not exist.
- Use `201` for successful resource creation.
- Use `204` for successful deletes with no body.
- Use `422` via FastAPI/Pydantic for invalid input.
- Use `500` only for unexpected failures.

Keep responsibility boundaries clear:

- routes map domain outcomes to HTTP status codes
- controllers coordinate resource-level validation
- services return domain data and business outcomes

---

## When Extending the Backend

When adding a new backend capability:

1. add or update Pydantic models first if the contract changes
2. implement or extend a service
3. add orchestration in a controller if needed
4. expose the feature in a route module
5. update `app/api/router.py` if a new route module is introduced
6. keep this instruction file in sync if the architecture or endpoint surface changes

## If a task changes the public API, update these instructions in the same change.

## applyTo: "server/\*\*"

# DBTalkie — Backend Instructions

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

````
POST /chat/stream

```json
{
    "message": {
        "id": "<frontend-message-id>",
        "role": "user",
        "type": "text",
        "status": "complete",
        "data": { "text": "<full user message>" },
        "timestamp": "<iso-datetime>"
    },
    "database_id": "<database_id>",
    "conversation_id": "<conversation_id>"
}
````

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

````

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
````

---

## Current Phase: Mock Data

**The backend is currently in the mock phase.** There is no real database connection and no AI/LLM integration yet. The server must return the same mocked data that currently lives in the client's `chatMockData.ts`.

Specifically:

- `GET /databases` returns a static in-memory list of databases (PostgreSQL, MongoDB, SQLite).
- `POST /chat/stream` streams mocked SSE chunks — a text message followed by a widget — using the same keyword-based detection logic as the client mock (keywords: `schema`, `kpi`, `revenue`, `trend`, `line`, `bar`, `table`).
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
