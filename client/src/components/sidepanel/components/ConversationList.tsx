import type { JSX } from 'react'
import { Trash2 } from 'lucide-react'
import type { ConversationRecord } from '../../../types/database'

interface ConversationListProps {
  conversations: ConversationRecord[]
  onDeleteConversation: (conversationId: string) => void
  onClickConversation: (conversationId: string) => void
}

export const ConversationList = ({
  conversations,
  onDeleteConversation,
  onClickConversation,
}: ConversationListProps): JSX.Element => {
  return (
    <div className="flex max-h-72 w-full flex-1 flex-col overflow-y-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          role="button"
          tabIndex={0}
          onClick={() => onClickConversation(conversation.id)}
          onKeyDown={(e) =>
            e.key === 'Enter' && onClickConversation(conversation.id)
          }
          className="group flex w-full cursor-pointer items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 ease-out hover:border-emerald-400/20 hover:bg-zinc-800/45 focus-visible:border-emerald-400/30 focus-visible:bg-zinc-800/45 focus-visible:outline-none"
        >
          <span className="line-clamp-1 flex-1 text-xs text-zinc-400 transition-colors duration-300 group-hover:text-zinc-100 group-focus-visible:text-zinc-100">
            {conversation.title}
          </span>
          <button
            type="button"
            aria-label={`Eliminar conversacion ${conversation.title}`}
            onClick={(e) => {
              e.stopPropagation()
              onDeleteConversation(conversation.id)
            }}
            className="cursor-pointer rounded-lg p-1.5 text-rose-300 transition-all duration-300 ease-out hover:scale-110 hover:bg-rose-400/10 hover:text-rose-200"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
