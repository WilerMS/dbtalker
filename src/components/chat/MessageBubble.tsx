import type { JSX } from 'react'

import { MessageRenderer } from './WidgetRenderer'
import type { Message } from '../../types/chat'

interface MessageBubbleProps {
  message: Message
  showHeader?: boolean
}

export const MessageBubble = ({
  message,
  showHeader = true,
}: MessageBubbleProps): JSX.Element => {
  const isUserMessage = message.role === 'user'

  if (!showHeader) {
    return <MessageRenderer message={message} />
  }

  return (
    <article
      className={[
        'flex w-full items-start gap-3 text-zinc-100',
        isUserMessage ? 'justify-end' : 'justify-start',
      ].join(' ')}
    >
      {!isUserMessage ? (
        <span
          aria-label="Assistant"
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-zinc-900/80 text-xs font-semibold text-emerald-300"
        >
          AI
        </span>
      ) : null}

      <div className="max-w-3xl flex-1">
        <div
          className={[
            'mb-2 flex items-center gap-3 text-xs',
            isUserMessage ? 'justify-end' : 'justify-start',
          ].join(' ')}
        >
          <span className="tracking-[0.3em] text-zinc-400 uppercase">
            {isUserMessage ? 'User' : 'Assistant'}
          </span>
          <span className="text-zinc-600">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <MessageRenderer message={message} />
      </div>

      {isUserMessage ? (
        <span
          aria-label="User"
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-semibold text-zinc-200"
        >
          U
        </span>
      ) : null}
    </article>
  )
}
