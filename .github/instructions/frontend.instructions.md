---
applyTo: "client/**"
---

# DBTalker — Frontend Instructions

These rules apply to **all files under `client/`**. Read them in full before writing or modifying any frontend code. For the overall project context, flow, and SSE contract, refer to [`copilot-instructions.md`](../copilot-instructions.md).

---

## Tech Stack

| Concern         | Library / Tool                           |
| --------------- | ---------------------------------------- |
| Framework       | React 19 + Vite                          |
| Language        | TypeScript 5 (`strict: true`)            |
| Async state     | TanStack Query (`@tanstack/react-query`) |
| Routing         | react-router-dom v7                      |
| Animations      | Framer Motion                            |
| Charts          | ApexCharts + `react-apexcharts`          |
| Schema diagrams | ReactFlow 11                             |
| Styles          | Tailwind CSS                             |

---

## Hard Rules

- **NEVER** use `fetch(...)` or `axios` directly. All I/O must be routed through the mock service layer at `src/services/`.
- **NEVER** use `any` in TypeScript. Use explicit interfaces and union types.
- **NEVER** import Chart.js, Recharts, or any other charting library outside of ApexCharts.
- **ALWAYS** maintain full TypeScript typing on props, state, service return values, and message payloads.
- **ALWAYS** use functional React components and custom hooks. No class components.

---

## Client–Server Communication

When the API layer is active (`chatService.ts`), the client communicates with the server using two protocols:

### REST (database management)

- `GET /databases` — list all registered databases.
- `POST /databases` — register a new database.
- `GET /databases/:id` — get a single database.
- `PATCH /databases/:id` — update a database.
- `DELETE /databases/:id` — delete a database.

All of these must go through `src/services/dbService.ts`.

### SSE (chat streaming)

- `GET /chat/stream?query=...&databaseId=...` — opens an SSE stream.
- Consumed via an `AsyncGenerator<SSEChunk>` inside `streamAssistantResponse()`.
- **The SSEChunk format is the cross-cutting contract between client and server.** See the section below and [`src/types/chat.ts`](../src/types/chat.ts) for the canonical types.

---

## SSE Chunk Format

The server emits chunks in three shapes. The client consumes them in `useChat.ts` via `for await (const chunk of streamAssistantResponse(...))`.

```typescript
// Phase 1 — server is starting to respond; client shows a skeleton
{ event: 'incoming', type: MessageType }

// Phase 2 — full data is ready; client replaces skeleton with real widget/text
{ event: 'data', type: MessageType,  data: MessageData }

// Phase 3 — stream is complete
{ event: 'finished' }
```

The `type` field drives widget selection. Valid values: `'text' | 'schema' | 'kpi' | 'bar' | 'line' | 'table'`.

A single user query may produce **two consecutive chunk sequences** — first a `text` message, then optionally a widget (`schema | kpi | bar | line | table`). Each sequence follows the `incoming → data → finished` pattern, but `finished` is emitted only once at the very end.

---

## Message System & Chat State

Messages are managed in `useChat.ts` as an append-only array:

```typescript
type Message = PendingMessage | CompleteMessage;
```

Key invariants:

- The array is **never mutated** — always replace with a new array.
- A `PendingMessage` (status: `'pending'`) is added on `incoming` and replaced by a `CompleteMessage` (status: `'complete'`) on `data`.
- The `type` field on every message drives which widget component is rendered.

Widget rendering is handled by a **centralized `switch` statement** in the chat feed component. Never scatter widget-type branching across multiple components.

---

## Folder Structure

Follow this canonical structure. Do not create new top-level directories under `src/` without a clear reason.

```
src/
  types/           # TypeScript interfaces only —  chat.ts, database.ts
  services/        # Data access layer (mock + api)
    mocks/
  hooks/           # Custom React hooks (useChat, etc.)
  routes/          # React Router route components
  components/
    layout/        # App shell, page layouts, sidepanel
    chat/          # ChatInput, AiMessage, UserMessage, MainChat, LoadingMessage
    chat/widgets/  # BarChartWidget, KpiWidget, LineChartWidget, SchemaWidget, TableWidget
    chat/skeletons/# Per-widget loading states
    ui/            # Reusable atoms (ExpandableWidget, WidgetModal)
```

---

## Routing

- The app uses `react-router-dom` v7.
- The main chat view is accessible at `/:id_db`.
- The `id_db` param is read inside `DatabaseRoute` and passed to `useChat(databaseId)`.
- All chat interactions (messages, streaming, widget injection) are scoped to the active `databaseId`.

---

## TanStack Query

- Use `useQuery` for any data that needs to be fetched and cached (e.g., `listDatabases`).
- Use `useMutation` for writes (e.g., `createDatabase`, `deleteDatabase`).
- Invalidate the `['databases']` query key after any mutation that changes the list.
- Do not manage async server state with `useState` + `useEffect` when TanStack Query can own it.

---

## Agent Skills

Before writing frontend code, load the relevant skill for the sub-domain you are working on:

| Task                                                            | Skill                   |
| --------------------------------------------------------------- | ----------------------- |
| React structure, hooks, mock services, TypeScript interfaces    | `frontend-architecture` |
| Chat feed, message array, widget rendering, data visualizations | `generative-ui-widgets` |
| Tailwind classes, new visual components, hover/focus states     | `ui-frontend-designer`  |

Skills are located in `.github/skills/`.

---

## Visual System (Summary)

The full visual spec lives in the `ui-frontend-designer` skill. Key rules:

- **Backgrounds**: `bg-zinc-950` for the main canvas, `bg-zinc-900/50` for cards and containers.
- **Borders**: `border-zinc-800`. No harsh white borders.
- **Accents**: `text-emerald-400`, `border-emerald-400/50`, `bg-emerald-400/10`.
- **Glow**: `shadow-[0_0_15px_rgba(52,211,153,0.15)]` on hover/focus with a `transition-shadow` duration of 300 ms.
- **Chat input**: floating, `rounded-full`, `backdrop-blur-md`, no top border.
- Avoid flat white surfaces or generic dashboard styling.
