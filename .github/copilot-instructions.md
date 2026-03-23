# DBTalkie — Prime Directive

**Project Identity:** DBTalkie is a futuristic, cyberpunk-minimal, dark-mode AI chat assistant. At its core it is a **Text-to-SQL** application: users connect SQL databases and query them using natural language. The application transforms natural language into SQL, executes queries, and returns results as rich, animated widgets (tables, charts, schema diagrams, KPI cards) alongside natural-language explanations.

---

## Application Architecture

DBTalkie is a **full-stack application** split into two workspaces:

| Layer             | Location  | Stack                                         |
| ----------------- | --------- | --------------------------------------------- |
| Frontend (client) | `client/` | React 19 + Vite + TypeScript + TanStack Query |
| Backend (server)  | `server/` | Python 3.12 + FastAPI + uv + sse-starlette    |

For **detailed rules per layer**, read the instruction file that matches the code you are working on:

- **Frontend** → [`.github/instructions/frontend.instructions.md`](.github/instructions/frontend.instructions.md) — applies to `client/**`
- **Backend** → [`.github/instructions/backend.instructions.md`](.github/instructions/backend.instructions.md) — applies to `server/**`

---

## Full Application Flow

Understanding this flow is essential before making any change to either layer:

1. **Client starts** → fetches registered databases via `GET /databases`. The response is displayed in the `SidePanel`.
2. **User selects a database** → the client navigates to `/:id_db`. The `databaseId` is read from the URL and scopes all subsequent interactions.
3. **Chat loads** → client fetches the message history for that database via `GET /chat/messages?databaseId=<id>`. Messages are rendered in the chat feed.
4. **User sends a query** → the client sends it to `GET /chat/stream?query=<text>&database_id=<id>` and opens an SSE stream.
5. **Server processes the query** → detects the response type (text, table, chart, schema…) and begins streaming SSE chunks.
6. **Client consumes the stream** via `AsyncGenerator<SSEChunk>` inside `useChat.ts` → renders a skeleton on `incoming`, replaces with the real widget/text on `data`, finalizes on `finished`.
7. **Result displayed** → one or two messages appear in the chat feed (a text explanation + optionally a widget).

---

## SSE Contract (Cross-Cutting Rule)

The SSE chunk format is the **binding contract** between client and server. It must be identical on both sides. Never change it on one side without changing the other.

```
incoming  →  { event: "incoming", type: MessageType }
data      →  { event: "data",     type: MessageType,  data: MessageData }
finished  →  { event: "finished" }
```

`MessageType` values: `"text" | "schema" | "kpi" | "bar" | "line" | "table"`

A single user query may produce a **text sequence** followed by an optional **widget sequence**. `finished` is emitted only once, at the very end.

---

## Agent Skills Standard

This workspace uses the Agent Skills standard. Before implementing frontend code, discover and follow the skills available in `.github/skills/`.

- Use `frontend-architecture` when working on React structure, hooks, mock services, folder layout, routing, or TypeScript interfaces.
- Use `generative-ui-widgets` when working on the chat feed, the `messages` array, widget rendering, or visualization components.
- Use `ui-frontend-designer` when applying Tailwind classes, creating visual components, or working with CSS and hover/focus states.

If a requested task depends on a skill that does not exist yet, do not invent it — work from available skills and the rules in this file.

---

## Universal Rules (Both Layers)

- **Never break the SSE contract.** The chunk format defined above must be identical in `client/src/types/chat.ts` and the server's Pydantic models.
- **No untyped data** — `any` in TypeScript or `Any` in Python are forbidden everywhere.
- **No direct I/O on the client** — all data access goes through `src/services/`. No `fetch()` or `axios` outside the service layer.
- **Mock phase first** — the backend currently returns mocked data. Do not add real DB connections or LLM calls until the mock phase is complete and the SSE pipeline is validated end-to-end.
