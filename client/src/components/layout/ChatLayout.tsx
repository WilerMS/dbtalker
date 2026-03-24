import type { JSX } from 'react'

import { MainChat } from '../chat/MainChat'
import type { UseChatResult } from '../../hooks/useChat'

type ChatLayoutProps = UseChatResult

export const ChatLayout = ({
  isLoading,
  isStreaming,
  messages,
  sendMessage,
}: ChatLayoutProps): JSX.Element => {
  return (
    <div className="relative flex h-full overflow-hidden text-zinc-100">
      <MainChat
        isLoading={isLoading}
        isStreaming={isStreaming}
        messages={messages}
        sendMessage={sendMessage}
      />
    </div>
  )
}
