import type { JSX } from 'react'

import { LeftSidebar } from './LeftSidebar'
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
  const userMessageCount = messages.filter(
    (message) => message.role === 'user',
  ).length

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px] xl:px-6 xl:py-6">
        <LeftSidebar messageCount={userMessageCount} />
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
    </div>
  )
}
