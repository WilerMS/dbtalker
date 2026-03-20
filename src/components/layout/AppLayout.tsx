import type { JSX } from 'react'

import { RightSidebar } from './RightSidebar'
import { MainChat } from '../chat/MainChat'
import type { UseChatResult } from '../../hooks/useChat'

type AppLayoutProps = UseChatResult

export const AppLayout = ({
  injectWidget,
  isLoading,
  messages,
  sendMessage,
}: AppLayoutProps): JSX.Element => {
  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <MainChat
        isLoading={isLoading}
        messages={messages}
        sendMessage={sendMessage}
      />
      <RightSidebar
        injectWidget={injectWidget}
        isLoading={isLoading}
        messages={messages}
      />
    </div>
  )
}
