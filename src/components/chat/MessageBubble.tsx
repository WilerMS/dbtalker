import type { JSX } from 'react'

import { WidgetRenderer } from './WidgetRenderer'
import type { Message } from '../../types/chat'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps): JSX.Element => {
  const isUserMessage = message.role === 'user'

  return (
    <article
      className={[
        'max-w-3xl rounded-2xl border border-zinc-800 p-4 sm:p-5',
        isUserMessage
          ? 'ml-auto bg-zinc-900 text-zinc-100'
          : 'bg-zinc-900/50 text-zinc-100',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
          {isUserMessage ? 'User' : 'Assistant'}
        </span>
        <span className="text-xs text-zinc-600">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <WidgetRenderer message={message} />
    </article>
  )
}
