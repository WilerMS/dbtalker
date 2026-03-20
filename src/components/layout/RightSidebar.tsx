import type { JSX } from 'react'

import type { Message, MessageType } from '../../types/chat'

interface RightSidebarProps {
  injectWidget: (type: MessageType) => Promise<void>
  isLoading: boolean
  messages: Message[]
}

interface WidgetOption {
  label: string
  type: MessageType
}

const widgetOptions: WidgetOption[] = [
  { label: 'Lorem', type: 'text' },
  { label: 'Schema', type: 'schema' },
  { label: 'KPI', type: 'kpi' },
  { label: 'Bars', type: 'bar' },
  { label: 'Trend', type: 'line' },
  { label: 'Table', type: 'table' },
]

export const RightSidebar = ({
  injectWidget,
  isLoading,
}: RightSidebarProps): JSX.Element => {
  return (
    <aside className="fixed top-3 right-3 z-20 w-40 rounded-xl border border-zinc-800 bg-zinc-900/75 p-2 backdrop-blur-sm">
      <div className="grid gap-1.5">
        {widgetOptions.map((widget) => (
          <button
            key={widget.type}
            type="button"
            disabled={isLoading}
            onClick={() => {
              void injectWidget(widget.type)
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-left text-[9px] tracking-[0.16em] text-zinc-400 uppercase transition-shadow duration-300 hover:text-emerald-400 hover:shadow-[0_0_14px_rgba(52,211,153,0.45)] focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            {widget.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
