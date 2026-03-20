# DBTalker - Prime Directive

**Project Identity & Goal:** This codebase is a futuristic, cyberpunk-minimal, dark-mode AI chat assistant named **DBTalker**. At its core, DBTalker is a **Text-to-SQL** application that allows users to execute queries on SQL databases using natural language. All implementation decisions must reinforce that identity. Prioritize clean architecture, strong typing, modular code, and a visually striking neon-dark interface.

**Core Workflow & Routing:**

- Users can connect a new SQL database from the side panel by clicking a "+" button.
- Once connected, the database appears in the side panel's database list.
- Clicking on a specific database in the list navigates the user to the route `/:id_db`.
- Under this specific route, all chat interactions, generative UI widgets, and Text-to-SQL questions are contextually scoped to that selected database.

## Agent Skills Standard

This workspace uses the Agent Skills standard. Before implementing code, discover and follow the skills available in `.github/skills/`.

- Use `frontend-architecture` when working on React structure, hooks, mock services, folder layout, routing (`react-router-dom`), or TypeScript interfaces.
- Use `generative-ui-widgets` when working on the chat feed, the `messages` array, widget rendering, or visualization components.

If a requested task depends on a skill that does not exist yet, do not invent it. Work from the available skills and the repository rules.

## Universal Rules

- NEVER use `fetch(...)` or `axios`. All I/O must go through the mock `src/services/` layer.
- NEVER use `any` in TypeScript.
- NEVER use third-party charting libraries such as Chart.js or Recharts.
- ALWAYS keep the frontend decoupled from a real backend through async mock services that return `Promise<T>`.
- ALWAYS maintain strict TypeScript typing for props, state, service returns, and message payloads.

## Implementation Defaults

- Prefer functional React components and custom hooks.
- Keep components focused and modular.
- Follow the canonical structure: `src/types`, `src/services`, `src/hooks`, `src/components/layout`, `src/components/chat`, and `src/components/widgets`.
- Route generative UI rendering from the chat message `type` field, using a centralized `switch` in the chat feed.
- Use dynamic routing (e.g., React Router) to handle the `/:id_db` database selection state.

## UI Direction

- Default to the project's neon-dark visual system.
- Favor `bg-zinc-950` backgrounds, zinc surfaces, emerald accents, and soft glow interactions.
- Avoid harsh borders, flat white surfaces, or generic dashboard styling.
