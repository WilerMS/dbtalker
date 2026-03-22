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
  isStreaming,
  messages,
  onSelectDatabase,
  selectedDatabaseId,
  sendMessage,
}: ChatLayoutProps): JSX.Element => {
  return (
    <div className="relative flex h-screen overflow-hidden text-zinc-100">
      <SidePanel
        databases={databases}
        onSelectDatabase={onSelectDatabase}
        selectedDatabaseId={selectedDatabaseId}
      />
      <MainChat
        isLoading={isLoading}
        isStreaming={isStreaming}
        messages={messages}
        sendMessage={sendMessage}
      />
      <RightSidebar
        injectWidget={injectWidget}
        isLoading={isLoading || isStreaming}
        messages={messages}
      />
    </div>
  )
}
