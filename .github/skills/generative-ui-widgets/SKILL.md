---
name: generative-ui-widgets
description: Use this skill when working on the chat feed, managing the message array state, or building data visualization components such as schema diagrams, KPI cards, charts, and tables.
---

# Generative UI & Widgets

## 1. Message State & Immutability

- The chat state is an array of `Message` objects managed in a `useChat` hook.
- It is append-only. Use `setMessages((prev) => [...prev, newMessage])`.
- The `Message` interface MUST include: `id` (string), `role` (`user` | `bot`), `type` (`MessageType`), and `data` (discriminated union payload).

## 2. Widget Rendering Switch

Widgets are mounted inside the chat feed using a strict `switch` statement based on `message.type`.

```typescript
switch (message.type) {
  case "schema":
    return <SchemaWidget data={message.data} />;
  case "kpi":
    return <KpiWidget data={message.data} />;
  case "bar":
    return <BarChartWidget data={message.data} />;
  case "line":
    return <LineChartWidget data={message.data} />;
  case "table":
    return <TableWidget data={message.data} />;
  default:
    return <p>{message.data.text}</p>;
}
```

## 3. Widget-Specific Constraints

- SchemaWidget: Use `reactflow`. Custom node rendering only, with dark surfaces and emerald edges.
- BarChartWidget: Use CSS Flexbox bars with vertical gradients from `emerald-900` to `emerald-400`.
- LineChartWidget: Use raw `svg`. The path must use `stroke="#34d399"` and include a drop-shadow filter.
- KpiWidget: Metric text must use `text-5xl font-bold text-emerald-400` with a glow effect.

## 4. Completion Checklist

- Message appends are immutable.
- Widget render routing is centralized in a `switch`.
- Widget visuals follow project neon-dark constraints.
- No third-party charting library is introduced.
