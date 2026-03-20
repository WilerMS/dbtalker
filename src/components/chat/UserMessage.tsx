import type { JSX } from 'react'

import type { Message, TextData } from '../../types/chat'

interface UserMessageProps {
  message: Message
}

export const UserMessage = ({ message }: UserMessageProps): JSX.Element => {
  return (
    <p className="rounded-2xl rounded-tr-none border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm leading-7 whitespace-pre-wrap text-zinc-100 shadow-sm shadow-black/40">
      {(message.data as TextData).text}
    </p>
  )
}
