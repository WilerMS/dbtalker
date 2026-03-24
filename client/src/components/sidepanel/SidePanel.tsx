import { useState } from 'react'
import type { FC } from 'react'
import { Settings, LogOut, Plus } from 'lucide-react'
import type { DatabaseRecord } from '../../types/database'
import { AuxPanel } from './components/AuxPanel'
import { SidePanelItemButton } from './components/SidePanelItemButton'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetDatabases } from '../../hooks/useDatabases/useGetDatabases'
import { DynamicIcon } from '../ui/DynamicIcon'
import { useDelayedHide } from './hooks/useDelayedHide'
import { Logo } from '../ui/Logo'

export const SidePanel: FC = () => {
  const navigate = useNavigate()

  const { id_db: selectedDatabaseId } = useParams<{ id_db: string }>()
  const { databases = [] } = useGetDatabases()

  const [hoveredDb, setHoveredDb] = useState<DatabaseRecord>()
  const [hoveredRect, setHoveredRect] = useState<DOMRect>()

  const { cancelHide, scheduleHide } = useDelayedHide(() => {
    setHoveredDb(undefined)
  })

  return (
    <aside className="pointer-events-none z-30">
      <nav
        aria-label="Database menu"
        className="pointer-events-auto flex h-full w-20 flex-col items-center gap-3 border-r border-zinc-700/40 bg-linear-to-b from-zinc-900/62 via-emerald-950/48 to-zinc-900/58 py-4 shadow-[0_0_28px_rgba(16,185,129,0.1)] backdrop-blur-md"
      >
        <header className="mb-1 flex flex-col items-center gap-2 border-b border-zinc-800/85 pb-3">
          <button
            className="flex cursor-pointer flex-col items-center justify-center gap-2"
            onClick={() => void navigate('/app')}
          >
            <Logo className="w-10 rounded-lg! p-2! [&>svg]:size-5" />
            <span className="text-[9px] tracking-[0.14em] text-zinc-300">
              DBTalkie
            </span>
          </button>
        </header>

        {databases.map((database) => (
          <SidePanelItemButton
            key={database.id}
            isActive={database.id === selectedDatabaseId}
            onMouseLeave={scheduleHide}
            onMouseEnter={(e) => {
              cancelHide()
              setHoveredDb(database)
              setHoveredRect(e.currentTarget.getBoundingClientRect())
            }}
          >
            <DynamicIcon name={database.icon} size={20} />
          </SidePanelItemButton>
        ))}

        <SidePanelItemButton title="Add database">
          <Plus size={20} />
        </SidePanelItemButton>

        <div className="grow" />

        <SidePanelItemButton
          onClick={() => void navigate('/app/settings')}
          title="Settings"
        >
          <Settings size={20} />
        </SidePanelItemButton>

        <SidePanelItemButton title="Log out" variant="danger">
          <LogOut size={20} />
        </SidePanelItemButton>
      </nav>

      <AuxPanel
        anchorRect={hoveredRect}
        database={hoveredDb}
        isVisible={Boolean(hoveredRect && hoveredDb)}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      />
    </aside>
  )
}
