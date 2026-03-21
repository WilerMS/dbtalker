import type { JSX } from 'react'
import { Database, Leaf, HardDrive } from 'lucide-react'
import type { DatabaseEngine, DatabaseRecord } from '../../types/database'

interface SidePanelProps {
  databases: DatabaseRecord[]
  selectedDatabaseId: string
  onSelectDatabase: (databaseId: string) => void
}

const getDatabaseIcon = (engine: DatabaseEngine): JSX.Element => {
  switch (engine) {
    case 'mongodb':
      return <Leaf size={20} />
    case 'sqlite':
      return <HardDrive size={20} />
    case 'postgresql':
    default:
      return <Database size={20} />
  }
}

export const SidePanel = ({
  databases,
  onSelectDatabase,
  selectedDatabaseId,
}: SidePanelProps): JSX.Element => {
  return (
    <aside className="pointer-events-none fixed left-0 z-30 h-screen">
      <nav
        aria-label="Database menu"
        className="pointer-events-auto flex h-full w-20 flex-col items-center gap-3 border-r border-zinc-700/80 bg-zinc-900/74 py-4 shadow-[0_0_28px_rgba(16,185,129,0.1)] backdrop-blur-md"
      >
        <header className="mb-1 flex flex-col items-center gap-2 border-b border-zinc-800/85 pb-3">
          <span className="grid size-9 place-items-center rounded-full border border-emerald-500/60 bg-zinc-900/85 text-[11px] font-semibold tracking-[0.08em] text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            ◉
          </span>
          <span className="text-[9px] tracking-[0.14em] text-zinc-300 uppercase">
            KubePath
          </span>
        </header>

        {databases.map((database) => (
          <button
            key={database.id}
            type="button"
            aria-current={database.id === selectedDatabaseId}
            aria-label={database.name}
            title={database.name}
            onClick={() => {
              onSelectDatabase(database.id)
            }}
            className={`group flex size-11 cursor-pointer items-center justify-center rounded-full border bg-zinc-800/70 shadow-[inset_0_0_0_1px_rgba(24,24,27,0.75)] transition-all duration-300 ease-out ${
              database.id === selectedDatabaseId
                ? 'border-emerald-300/95 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.45),inset_0_0_0_1px_rgba(16,185,129,0.4)]'
                : 'border-emerald-500/55 text-emerald-200 hover:border-emerald-300/90 hover:bg-zinc-800/95 hover:text-emerald-100 hover:shadow-[0_0_18px_rgba(52,211,153,0.38),inset_0_0_0_1px_rgba(16,185,129,0.4)]'
            }`}
          >
            <span className="transition-transform duration-300 group-hover:scale-105">
              {getDatabaseIcon(database.engine)}
            </span>
          </button>
        ))}

        <button
          type="button"
          aria-label="Add database"
          title="Add database"
          className="group flex size-11 cursor-pointer items-center justify-center rounded-full border border-emerald-500/55 bg-zinc-800/70 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(24,24,27,0.75)] transition-all duration-300 ease-out hover:border-emerald-300/90 hover:bg-zinc-800/95 hover:text-emerald-100 hover:shadow-[0_0_18px_rgba(52,211,153,0.38),inset_0_0_0_1px_rgba(16,185,129,0.4)]"
        >
          +
        </button>
      </nav>
    </aside>
  )
}
