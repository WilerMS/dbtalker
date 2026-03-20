import type { JSX } from 'react'

import { RightSidebar } from './RightSidebar'
import { MainChat } from '../chat/MainChat'
import { SidePanel } from '../sidepanel/SidePanel'
import type { UseChatResult } from '../../hooks/useChat'

type AppLayoutProps = UseChatResult

export const AppLayout = ({
  injectWidget,
  isLoading,
  messages,
  sendMessage,
}: AppLayoutProps): JSX.Element => {
  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <SidePanel />
      <div className="h-full pl-16 sm:pl-20">
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
