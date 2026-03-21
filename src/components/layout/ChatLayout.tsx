import type { JSX } from 'react'

import { RightSidebar } from './RightSidebar'
import { MainChat } from '../chat/MainChat'
import { SidePanel } from '../sidepanel/SidePanel'
import type { UseChatResult } from '../../hooks/useChat'
import type { DatabaseRecord } from '../../types/database'

interface ChatLayoutProps extends UseChatResult {
  databases: DatabaseRecord[]
  selectedDatabaseId: string
  onSelectDatabase: (databaseId: string) => void
}

export const ChatLayout = ({
  databases,
  injectWidget,
  isLoading,
  messages,
  onSelectDatabase,
  selectedDatabaseId,
  sendMessage,
}: ChatLayoutProps): JSX.Element => {
  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <SidePanel
        databases={databases}
        onSelectDatabase={onSelectDatabase}
        selectedDatabaseId={selectedDatabaseId}
      />
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
