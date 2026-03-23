import type { JSX } from 'react'
import { Database, Leaf, HardDrive, Settings, LogOut, Plus } from 'lucide-react'
import type { DatabaseEngine, DatabaseRecord } from '../../types/database'
import { SidePanelItemButton } from './SidePanelItemButton'
import logo from '../../assets/logo.png'

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
    <aside className="pointer-events-none z-30">
      <nav
        aria-label="Database menu"
        className="pointer-events-auto flex h-full w-20 flex-col items-center gap-3 border-r border-zinc-700/40 bg-linear-to-b from-zinc-900/62 via-emerald-950/48 to-zinc-900/58 py-4 shadow-[0_0_28px_rgba(16,185,129,0.1)] backdrop-blur-md"
      >
        <header className="mb-1 flex flex-col items-center gap-2 border-b border-zinc-800/85 pb-3">
          <img src={logo} alt="DBTalkie logo" className="size-10" />
          <span className="text-[9px] tracking-[0.14em] text-zinc-300">
            DBTalkie
          </span>
        </header>

        {databases.map((database) => (
          <SidePanelItemButton
            key={database.id}
            ariaLabel={database.name}
            title={database.name}
            isActive={database.id === selectedDatabaseId}
            onClick={() => {
              onSelectDatabase(database.id)
            }}
          >
            {getDatabaseIcon(database.engine)}
          </SidePanelItemButton>
        ))}

        <SidePanelItemButton ariaLabel="Add database" title="Add database">
          <Plus size={20} />
        </SidePanelItemButton>

        <div className="grow" />

        <SidePanelItemButton ariaLabel="Settings" title="Settings">
          <Settings size={20} />
        </SidePanelItemButton>

        <SidePanelItemButton
          ariaLabel="Log out"
          title="Log out"
          variant="danger"
        >
          <LogOut size={20} />
        </SidePanelItemButton>
      </nav>
    </aside>
  )
}
