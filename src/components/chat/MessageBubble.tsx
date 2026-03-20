import type { JSX } from 'react'

import { MessageRenderer } from './MessageRenderer'
import type { Message } from '../../types/chat'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps): JSX.Element => {
  return <MessageRenderer message={message} />
}
