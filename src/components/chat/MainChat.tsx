import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react'

import { ChatComposer } from './ChatComposer'
import { LoadingMessage } from './LoadingMessage'
import { MessageBubble } from './MessageBubble'
import { SpeakerAvatar } from './SpeakerAvatar'
import type { Message } from '../../types/chat'

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
  const [draft, setDraft] = useState<string>('')
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [isLoading, messages])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    const nextDraft = draft.trim()

    if (!nextDraft || isLoading) {
      return
    }

    setDraft('')
    await sendMessage(nextDraft)
  }

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 min-h-0 flex-1 overflow-y-auto pt-4 pb-45">
        <div className="mx-auto flex w-full max-w-187.5 flex-col gap-4">
          {groupMessagesByRole(messages).map((group) => (
            <div
              key={`${group.role}-${group.timestamp.getTime()}`}
              className={[
                'flex w-full items-start gap-3',
                group.role === 'user' ? 'justify-end' : 'justify-start',
              ].join(' ')}
            >
              <div className="flex w-full min-w-0 flex-col gap-2">
                <SpeakerAvatar
                  role={group.role as 'user' | 'bot'}
                  timestamp={group.timestamp}
                  orientation={group.role === 'user' ? 'right' : 'left'}
                />
                <div className="w-full max-w-3xl min-w-0">
                  <div className="flex flex-col gap-3">
                    {group.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        showHeader={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading ? <LoadingMessage /> : null}
          <div ref={bottomAnchorRef} />
        </div>
      </div>

      <ChatComposer
        draft={draft}
        isLoading={isLoading}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
