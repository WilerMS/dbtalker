import { useState } from 'react'
import type { FC } from 'react'
import { dark } from '@clerk/themes'
import { Show, useClerk, useUser } from '@clerk/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Settings, Plus, User } from 'lucide-react'

import type { DatabaseRecord } from '../../types/database'
import { Logo } from '../ui/Logo'
import { DynamicIcon } from '../ui/DynamicIcon'
import { AuxPanel } from './components/AuxPanel'
import { useModal } from '../../hooks/useModal'
import { SidePanelItemButton } from './components/SidePanelItemButton'
import { useGetDatabases } from '../../hooks/useDatabases/useGetDatabases'
import { useDelayedHide } from './hooks/useDelayedHide'
import { CreateDatabaseModalContent } from './components/database-manager'
import { UserButton } from './components/user-button/UserButton'
import { useGetDemoDatabase } from '../../hooks/useDatabases'

export const SidePanel: FC = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const { openSignIn } = useClerk()
  const { isSignedIn } = useUser()

  const { id_db: selectedDatabaseId } = useParams<{ id_db: string }>()
  const { databases = [] } = useGetDatabases()
  const { database: demoDatabase } = useGetDemoDatabase()

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
            onClick={() => void navigate('/app', { viewTransition: true })}
          >
            <Logo className="w-10 rounded-lg! p-2! [&>svg]:size-5" />
            <span className="text-[9px] tracking-[0.14em] text-zinc-300">
              DBTalkie
            </span>
          </button>
        </header>

        {!!demoDatabase && (
          <SidePanelItemButton
            isActive={import.meta.env.VITE_DEMO_DB_ID === selectedDatabaseId}
            onMouseLeave={scheduleHide}
            onMouseEnter={(e) => {
              cancelHide()
              setHoveredDb(demoDatabase)
              setHoveredRect(e.currentTarget.getBoundingClientRect())
            }}
          >
            <DynamicIcon name={'DatabaseZap'} size={20} />
          </SidePanelItemButton>
        )}

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

        <SidePanelItemButton
          title="Add database"
          onClick={() => {
            if (!isSignedIn) return openSignIn({ appearance: { theme: dark } })
            openModal({
              content: ({ closeModal }) => (
                <CreateDatabaseModalContent
                  onClose={closeModal}
                  onCreationSuccess={(databaseId, conversationId) => {
                    navigate(
                      `/app/${databaseId}/conversations/${conversationId}`,
                      {
                        viewTransition: true,
                      },
                    )
                  }}
                />
              ),
              size: {
                width: 'min(94vw, 750px)',
                maxHeight: '90vh',
              },
            })
          }}
        >
          <Plus size={20} />
        </SidePanelItemButton>

        <div className="grow" />

        <UserButton />

        <Show when="signed-in">
          <SidePanelItemButton
            onClick={() =>
              void navigate('/app/settings', { viewTransition: true })
            }
            title="Settings"
          >
            <Settings size={20} />
          </SidePanelItemButton>
        </Show>

        <Show when="signed-out">
          <SidePanelItemButton
            onClick={() => void openSignIn({ appearance: { theme: dark } })}
            title="Settings"
          >
            <User size={20} />
          </SidePanelItemButton>
        </Show>
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
