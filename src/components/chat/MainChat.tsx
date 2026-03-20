import { useEffect, useMemo, useRef, type JSX } from 'react'

import { ChatComposer } from './ChatComposer'
import { LoadingMessage } from './LoadingMessage'
import { SpeakerAvatar } from './SpeakerAvatar'
import type { Message } from '../../types/chat'
import { UserMessage } from './UserMessage'
import { AIMessage } from './AIMessage'

interface MessageGroup {
  role: string
  timestamp: Date
  messages: Message[]
}

interface MainChatProps {
  isLoading: boolean
  messages: Message[]
  sendMessage: (text: string) => Promise<void>
}

const groupMessagesByRole = (messages: Message[]): MessageGroup[] => {
  if (messages.length === 0) return []

  const groups: MessageGroup[] = []
  let currentGroup: MessageGroup | null = null

  for (const message of messages) {
    if (!currentGroup || currentGroup.role !== message.role) {
      currentGroup = {
        role: message.role,
        timestamp: message.timestamp,
        messages: [message],
      }
      groups.push(currentGroup)
    } else {
      currentGroup.messages.push(message)
    }
  }

  return groups
}

export const MainChat = ({
  isLoading,
  messages,
  sendMessage,
}: MainChatProps): JSX.Element => {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [isLoading, messages])

  const handleSubmit = async (value: string): Promise<void> => {
    const nextDraft = value.trim()

    if (!nextDraft || isLoading) {
      return
    }

    await sendMessage(nextDraft)
  }

  const groupedMessages = useMemo(
    () => groupMessagesByRole(messages),
    [messages],
  )

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden backdrop-blur-sm">
      <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 min-h-0 flex-1 overflow-y-auto pt-4 pb-45">
        <div className="mx-auto flex w-full max-w-187.5 flex-col gap-6 px-4 lg:px-0">
          {groupedMessages.map((group) => (
            <div
              key={`${group.role}-${group.timestamp.getTime()}`}
              className={[
                'flex w-full items-start gap-3',
                group.role === 'user' ? 'justify-end' : 'justify-start',
              ].join(' ')}
            >
              <div className="flex w-full min-w-0 flex-col gap-4">
                <SpeakerAvatar
                  role={group.role as 'user' | 'bot'}
                  timestamp={group.timestamp}
                  orientation={group.role === 'user' ? 'right' : 'left'}
                />
                <div className="w-full max-w-3xl min-w-0">
                  <div className="flex flex-col gap-3">
                    {group.messages.map((message) =>
                      group.role === 'user' ? (
                        <UserMessage key={message.id} message={message} />
                      ) : (
                        <AIMessage key={message.id} message={message} />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading ? <LoadingMessage /> : null}
          <div ref={bottomAnchorRef} />
        </div>
      </div>

      <ChatComposer isLoading={isLoading} onSubmit={handleSubmit} />
    </section>
  )
}
