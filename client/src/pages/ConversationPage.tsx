import { MainChat } from '../components/chat/MainChat'
import { useParams } from 'react-router-dom'

export const ConversationPage = () => {
  const { id_db, id_conversation } = useParams<{
    id_db: string
    id_conversation: string
  }>()

  if (!id_db || !id_conversation) {
    return (
      <div className="grid h-full place-items-center text-zinc-100">
        <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">
          Select a conversation to start chatting
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen overflow-hidden text-zinc-100">
      <MainChat databaseId={id_db} conversationId={id_conversation} />
    </div>
  )
}
