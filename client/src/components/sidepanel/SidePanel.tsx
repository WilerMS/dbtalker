import { useEffect, useRef, useState } from 'react'
import type { JSX } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Database, Leaf, HardDrive, Settings, LogOut, Plus } from 'lucide-react'
import type { DatabaseRecord } from '../../types/database'
import { getConversationsByDatabaseId } from '../../services/dbService'
import { SidePanelAuxPanel } from './components/SidePanelAuxPanel'
import type { ConversationItem } from './components/SidePanelConversationList'
import { SidePanelItemButton } from './components/SidePanelItemButton'

interface SidePanelProps {
  databases: DatabaseRecord[]
  selectedDatabaseId: string
  onSelectDatabase: (databaseId: string) => void
}

const getDatabaseIcon = (engine: DatabaseRecord['engine']): JSX.Element => {
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
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null)
  const [hoveredDatabase, setHoveredDatabase] = useState<DatabaseRecord | null>(
    null,
  )
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimeout.current !== null) {
        clearTimeout(hideTimeout.current)
      }
    }
  }, [])

  // Fetch conversations for the hovered database
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useQuery({
      queryKey: ['conversations', hoveredDatabase?.id],
      queryFn: () => {
        if (!hoveredDatabase) return Promise.resolve([])
        return getConversationsByDatabaseId(hoveredDatabase.id)
      },
      enabled: !!hoveredDatabase,
    })

  const conversationItems: ConversationItem[] = conversations.map((conv) => ({
    id: conv.id,
    title: conv.title,
  }))

  const cancelHide = () => {
    if (hideTimeout.current !== null) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
  }

  const scheduleHide = () => {
    cancelHide()
    hideTimeout.current = setTimeout(() => {
      setHoveredRect(null)
      setHoveredDatabase(null)
    }, 120)
  }

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
            onMouseEnter={(e) => {
              cancelHide()
              setHoveredRect(
                (e.currentTarget as HTMLDivElement).getBoundingClientRect(),
              )
              setHoveredDatabase(database)
            }}
            onMouseLeave={scheduleHide}
          >
            <SidePanelItemButton
              ariaLabel={database.name}
              isActive={database.id === selectedDatabaseId}
              onClick={() => {
                onSelectDatabase(database.id)
              }}
            >
              {getDatabaseIcon(database.engine)}
            </SidePanelItemButton>
          </div>
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

      <SidePanelAuxPanel
        anchorRect={hoveredRect}
        database={hoveredDatabase}
        conversations={conversationItems}
        isLoading={isLoadingConversations}
        isVisible={hoveredRect !== null && hoveredDatabase !== null}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
        onEditDatabase={() => {
          if (!hoveredDatabase) return
          console.log('Editar base de datos', hoveredDatabase.id)
        }}
        onDeleteDatabase={() => {
          if (!hoveredDatabase) return
          console.log('Eliminar base de datos', hoveredDatabase.id)
        }}
        onDeleteConversation={(conversationId) => {
          if (!hoveredDatabase) return
          console.log(
            'Eliminar conversacion',
            conversationId,
            'de la base de datos',
            hoveredDatabase.id,
          )
        }}
        onClickConversation={(conversationId) => {
          if (!hoveredDatabase) return
          console.log(
            'Abrir conversacion',
            conversationId,
            'de la base de datos',
            hoveredDatabase.id,
          )
        }}
        onClickNewConversation={() => {
          if (!hoveredDatabase) return
          console.log(
            'Nueva conversacion para la base de datos',
            hoveredDatabase.id,
          )
        }}
      />
    </aside>
  )
}
