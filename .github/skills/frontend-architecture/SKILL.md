---
name: frontend-architecture
description: Use this skill when structuring the React app, managing global state, writing custom hooks, creating mock services, or defining TypeScript interfaces.
---

# Frontend Architecture & React Patterns

## 1. The Mock Service Pattern (MANDATORY)

The frontend MUST be completely decoupled from a real backend.

- Location: `src/services/`
- Every function must return a `Promise<T>`.
- Latency simulation is required in every service function.
- Required line pattern:

```typescript
await new Promise((resolve) => setTimeout(resolve, 800))
```

- Example:

```typescript
export const sendChatMessage = async (query: string): Promise<Message> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    id: crypto.randomUUID(),
    role: 'bot',
    type: 'text',
    data: { text: `Mock response to: ${query}` },
  }
}
```

## 2. TypeScript & Component Rules

- `strict: true` is enabled. Do not use `any`.
- One component per file.
- Functional components only.
- Props must have explicitly named interfaces.

## 3. Directory Structure

- `/types` for interfaces only.
- `/services` for mock async functions.
- `/hooks` for custom hooks.
- `/components/layout` for app layout shells.
- `/components/chat` for chat-only components.
- `/components/widgets` for renderable data widgets.

## 4. Completion Checklist

- No direct HTTP calls in components or hooks.
- Services return `Promise<T>` with simulated latency.
- Types are explicit, strict-safe, and free of `any`.
- Architecture follows the canonical folder layout.
