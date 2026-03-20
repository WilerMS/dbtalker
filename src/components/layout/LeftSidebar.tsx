import type { JSX } from 'react'

interface LeftSidebarProps {
  messageCount: number
}

const quickSignals = ['schema explorer', 'sql copilot', 'generative widgets']

export const LeftSidebar = ({
  messageCount,
}: LeftSidebarProps): JSX.Element => {
  return (
    <aside className="flex flex-col gap-4 rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <p className="text-xs tracking-[0.35em] text-emerald-400 uppercase">
          KubePath
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">
          Database chat cockpit
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Base React + Vite con una capa mock, widgets generativos y la UI
          oscura que pide el proyecto.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
            Messages
          </p>
          <p className="mt-3 text-4xl font-bold text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.6)]">
            {messageCount}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
            Mode
          </p>
          <p className="mt-3 text-sm font-medium text-zinc-100">Mock service</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
            Theme
          </p>
          <p className="mt-3 text-sm font-medium text-zinc-100">Neon emerald</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
          Signals
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickSignals.map((signal) => (
            <span
              key={signal}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs tracking-[0.2em] text-zinc-400 uppercase transition-shadow duration-300 hover:text-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
