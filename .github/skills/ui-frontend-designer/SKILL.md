---
name: ui-frontend-designer
description: Use this skill whenever you are applying Tailwind classes, creating new visual components, styling hover/focus states, or working with CSS. It contains the strict neon cyberpunk aesthetic rules.
---

# UI & Design System

## 1. Color Palette & Containers

- **Background:** `bg-zinc-950` (Never pure black).
- **Containers/Cards:** `bg-zinc-900/50 border border-zinc-800`. NEVER use white or gray-700+ borders.
- **Text:** `text-zinc-100` (primary), `text-zinc-400` (secondary).
- **Accent:** `emerald-400` (Neon green).

## 2. The Neon Glow Effect

Applied ONLY on interactive states (hover/focus/active) via CSS transitions.

- **Standard Button/Card Hover:** `shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-shadow duration-300`
- **Active State:** `ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]`

## 3. The Floating Pill Chat Input (CRITICAL)

- Shape: `rounded-full`.
- Background: `bg-zinc-900/80 backdrop-blur-md`.
- **Constraint:** NO top border, NO horizontal rule separating it from the chat feed. It must float.
- Focus State: `focus-within:shadow-[0_0_20px_rgba(52,211,153,0.4)]`
