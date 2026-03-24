import { Plus } from 'lucide-react'
import type { DatabaseRecord } from '../../../types/database'
import { SidePanelConversationList } from './SidePanelConversationList'
import { SidePanelDatabaseActions } from './SidePanelDatabaseActions'
import { AuxPanelWrapper } from './AuxPanelWrapper'
import {
  useCreateConversation,
  useDeleteConversation,
  useGetConversations,
} from '../../../hooks/useConversations'
import { LoadingState } from '../../ui/LoadingState'
import { useNavigate } from 'react-router-dom'

interface AuxPanelProps {
  anchorRect?: DOMRect
  database?: DatabaseRecord
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onEditDatabase: () => void
  onDeleteDatabase: () => void
}

export const AuxPanel = ({
  anchorRect,
  database,
  isVisible,
  onMouseEnter,
  onMouseLeave,
  onEditDatabase,
  onDeleteDatabase,
}: AuxPanelProps) => {
  const isOpen = isVisible && Boolean(anchorRect && database)

  const navigate = useNavigate()

  const { createConversation } = useCreateConversation()
  const { deleteConversation } = useDeleteConversation()
  const { conversations = [], isLoading } = useGetConversations(database?.id)

  return (
    <AuxPanelWrapper
      isOpen={isOpen}
      anchorRect={anchorRect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!!database && (
        <>
          <header className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
                Base de datos
              </p>
              <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">
                {database.name}
              </h3>
            </div>

            <SidePanelDatabaseActions
              compact
              onEdit={onEditDatabase}
              onDelete={onDeleteDatabase}
            />
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 py-3">
            <p className="px-4 text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
              Conversaciones historicas
            </p>
            {isLoading ? (
              <LoadingState label="Cargando..." />
            ) : (
              <SidePanelConversationList
                conversations={conversations}
                onClickConversation={(conversationId) =>
                  void navigate(
                    `/${database.id}/conversations/${conversationId}`,
                  )
                }
                onDeleteConversation={(conversationId) => {
                  void deleteConversation({
                    databaseId: database.id,
                    conversationId,
                  })
                }}
              />
            )}
          </div>

          <div className="border-t border-zinc-800/80 p-3">
            <button
              type="button"
              onClick={() =>
                void createConversation({
                  databaseId: database.id,
                  title: 'Nueva conversacion',
                })
              }
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 ease-out hover:border-emerald-400/25 hover:bg-emerald-400/8 hover:text-zinc-100 hover:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:border-emerald-400/25 focus-visible:bg-emerald-400/8 focus-visible:text-zinc-100 focus-visible:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:outline-none"
            >
              <Plus size={14} />
              <span>Nueva conversacion</span>
            </button>
          </div>
        </>
      )}
    </AuxPanelWrapper>
  )
}
