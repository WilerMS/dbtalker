import type { JSX } from 'react'

import { MessageRenderer } from './MessageRenderer'
import type { Message } from '../../types/chat'

interface AIMessageProps {
  message: Message
}

export const AIMessage = ({ message }: AIMessageProps): JSX.Element => {
  return <MessageRenderer message={message} />
}
