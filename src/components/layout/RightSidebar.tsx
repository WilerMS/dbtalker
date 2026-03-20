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
    <aside className="fixed flex h-fit flex-col gap-4 rounded-4xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm xl:top-6 xl:right-6 xl:bottom-6 xl:z-20 xl:w-[320px] xl:max-w-[calc(100vw-3rem)]">
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
    </aside>
  )
}
