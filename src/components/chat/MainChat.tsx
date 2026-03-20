import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react'

import { ChatComposer } from './ChatComposer'
import { LoadingMessage } from './LoadingMessage'
import { MessageBubble } from './MessageBubble'
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
    <section className="relative flex min-h-[calc(100svh-2rem)] flex-col overflow-hidden rounded-4xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm xl:min-h-[calc(100svh-3rem)]">
      <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 flex-1 overflow-y-auto px-4 pt-4 pb-36 sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {groupMessagesByRole(messages).map((group) => (
            <div
              key={`${group.role}-${group.timestamp.getTime()}`}
              className="flex w-full items-start gap-3"
            >
              {group.role === 'bot' && (
                <span
                  aria-label="Assistant"
                  className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-zinc-900/80 text-xs font-semibold text-emerald-300"
                >
                  AI
                </span>
              )}

              <div className="max-w-3xl flex-1">
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span className="tracking-[0.3em] text-zinc-400 uppercase">
                    {group.role === 'user' ? 'User' : 'Assistant'}
                  </span>
                  <span className="text-zinc-600">
                    {group.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

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

              {group.role === 'user' && (
                <span
                  aria-label="User"
                  className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-semibold text-zinc-200"
                >
                  U
                </span>
              )}
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
