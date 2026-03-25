import { Plus } from 'lucide-react'
import type { DatabaseRecord } from '../../../types/database'
import { ConversationList } from './ConversationList'
import { DatabaseActions } from './DatabaseActions'
import { AuxPanelWrapper } from './AuxPanelWrapper'
import {
  useCreateConversation,
  useDeleteConversation,
  useGetConversations,
} from '../../../hooks/useConversations'
import { LoadingState } from '../../ui/LoadingState'
import { useNavigate, useParams } from 'react-router-dom'
import { useModal } from '../../../hooks/useModal'
import { UpdateDatabaseModalContent } from './create-database'

interface AuxPanelProps {
  anchorRect?: DOMRect
  database?: DatabaseRecord
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const AuxPanel = ({
  anchorRect,
  database,
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: AuxPanelProps) => {
  const isOpen = isVisible && Boolean(anchorRect && database)

  const { id_conversation } = useParams<{ id_conversation: string }>()
  const navigate = useNavigate()
  const { openModal } = useModal()

  // Conversations handlers
  const { createConversation } = useCreateConversation()
  const { deleteConversation } = useDeleteConversation()
  const { conversations = [], isLoading } = useGetConversations(database?.id)

  const handleCreateConversation = async (databaseId: string) => {
    onMouseLeave()

    const newConversation = await createConversation({
      databaseId,
      title: 'Nueva conversacion',
    })

    navigate(`/app/${databaseId}/conversations/${newConversation.id}`, {
      viewTransition: true,
    })
  }

  const handleEditDatabase = (database: DatabaseRecord) => {
    onMouseLeave()
    openModal({
      content: ({ closeModal }) => (
        <UpdateDatabaseModalContent database={database} onClose={closeModal} />
      ),
      size: {
        width: 'min(94vw, 750px)',
        maxHeight: '90vh',
      },
    })
  }

  // Database handlers here
  // TODO: Esto se implementará cuando tenga el panel de add database

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

            <DatabaseActions
              compact
              onEdit={() => void handleEditDatabase(database)}
              onDelete={() => {}} // TODO: Implementar eliminación de base de datos
            />
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 py-3">
            <p className="px-4 text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
              Conversaciones historicas
            </p>
            {isLoading ? (
              <LoadingState label="Cargando..." />
            ) : (
              <ConversationList
                conversations={conversations}
                onClickConversation={(conversationId) =>
                  void navigate(
                    `/app/${database.id}/conversations/${conversationId}`,
                    { viewTransition: true },
                  )
                }
                onDeleteConversation={(conversationId) => {
                  void deleteConversation({
                    databaseId: database.id,
                    conversationId,
                  })

                  if (id_conversation === conversationId) {
                    navigate(`/app`, { viewTransition: true })
                  }
                }}
              />
            )}
          </div>

          <div className="border-t border-zinc-800/80 p-3">
            <button
              type="button"
              onClick={() => handleCreateConversation(database.id)}
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
