import type { JSX } from 'react'

import type { Message, MessageType, PreviewWidgetType } from '../../types/chat'

interface RightSidebarProps {
  injectWidget: (type: MessageType) => Promise<void>
  isLoading: boolean
  messages: Message[]
}

interface WidgetOption {
  label: string
  type: PreviewWidgetType
}

const widgetOptions: WidgetOption[] = [
  { label: 'Schema', type: 'schema' },
  { label: 'KPI', type: 'kpi' },
  { label: 'Bars', type: 'bar' },
  { label: 'Trend', type: 'line' },
  { label: 'Table', type: 'table' },
]

export const RightSidebar = ({
  injectWidget,
  isLoading,
  messages,
}: RightSidebarProps): JSX.Element => {
  const widgetCount = messages.filter(
    (message) => message.type !== 'text',
  ).length

  return (
    <aside className="flex flex-col gap-4 rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm xl:min-h-full">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <p className="text-xs tracking-[0.35em] text-zinc-400 uppercase">
          Widget tester
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
          Inserta vistas en caliente
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Cada botón empuja un mensaje bot al feed usando la misma capa async
          mock que usaría el backend real.
        </p>
      </div>

      <div className="grid gap-3">
        {widgetOptions.map((widget) => (
          <button
            key={widget.type}
            type="button"
            disabled={isLoading}
            onClick={() => {
              void injectWidget(widget.type)
            }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-left text-sm tracking-[0.28em] text-zinc-400 uppercase transition-shadow duration-300 hover:text-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            {widget.label}
          </button>
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
          Feed state
        </p>
        <p className="mt-3 text-4xl font-bold text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.6)]">
          {widgetCount}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          widgets activos en la conversación
        </p>
      </div>
    </aside>
  )
}
