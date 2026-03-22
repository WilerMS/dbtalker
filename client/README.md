# Hackaton KubePath

Frontend React + TypeScript + Vite orientado a chat generativo con widgets de visualizacion.

## Stack

- React 19
- TypeScript (strict)
- Vite
- Tailwind CSS
- reactflow
- lucide-react

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run format:check
```

## Estructura esperada (frontend)

```text
src/
├── types/
├── services/
├── hooks/
└── components/
    ├── layout/
    ├── chat/
    └── widgets/
```

## Skills configurados

Se crearon skills en ambas rutas para compatibilidad:

- `.github/skills/frontend-architecture/SKILL.md`
- `.github/skills/generative-ui-widgets/SKILL.md`
- `.agents/skills/frontend-architecture/SKILL.md`
- `.agents/skills/generative-ui-widgets/SKILL.md`

## Reglas clave

- No usar `fetch` ni `axios` en componentes/hooks.
- Centralizar llamadas en `src/services/` con funciones `async` que devuelvan `Promise<T>`.
- Simular latencia en servicios (por ejemplo 800ms).
- Evitar `any` en TypeScript.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```
