import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react'

import { ChatComposer } from './ChatComposer'
import { LoadingMessage } from './LoadingMessage'
import { MessageBubble } from './MessageBubble'
import type { Message } from '../../types/chat'

interface MainChatProps {
  isLoading: boolean
  messages: Message[]
  sendMessage: (text: string) => Promise<void>
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
    <section className="relative flex min-h-[85svh] flex-col overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm xl:min-h-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.12),transparent_70%)]" />

      <header className="border-b border-zinc-800 px-5 py-5 sm:px-6">
        <p className="text-xs tracking-[0.35em] text-zinc-400 uppercase">
          Generative feed
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Conversa con la base de datos
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              El feed renderiza mensajes, esquemas, KPIs y tablas en el mismo
              hilo.
            </p>
          </div>
          <div className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs tracking-[0.3em] text-emerald-400 uppercase">
            mock layer online
          </div>
        </div>
      </header>

      <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 flex-1 overflow-y-auto px-4 pt-6 pb-36 sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
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
