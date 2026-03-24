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
          <div className="size-10 bg-emerald-800/70 opacity-70">
            {/* <img src={logo} alt="DBTalkie logo" className="" /> */}
          </div>
          <span className="text-[9px] tracking-[0.14em] text-zinc-300">
            DBTalkie
          </span>
        </header>

        {databases.map((database) => (
          <div
            key={database.id}
            onMouseLeave={scheduleHide}
            onMouseEnter={(e) => {
              cancelHide()
              setHoveredDb(database)
              setHoveredRect(e.currentTarget.getBoundingClientRect())
            }}
          >
            <SidePanelItemButton
              isActive={database.id === selectedDatabaseId}
              onClick={() => void navigate(`/${database.id}`)}
            >
              <DynamicIcon name={database.icon} size={20} />
            </SidePanelItemButton>
          </div>
        ))}

        <SidePanelItemButton title="Add database">
          <Plus size={20} />
        </SidePanelItemButton>

        <div className="grow" />

        <SidePanelItemButton title="Settings">
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
