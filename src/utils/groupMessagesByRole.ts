import type { Message } from '../types/chat'

export interface MessageGroup {
  role: string
  timestamp: Date
  messages: Message[]
}

export const groupMessagesByRole = (messages: Message[]): MessageGroup[] => {
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
