import { useMemo, useEffect, useState } from 'react'

import type {
  CompleteMessage,
  Message,
  MessageType,
  UserMessage,
} from '../types/chat'
import { ChatService } from '../services/chatService'

export interface UseChatResult {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  sendMessage: (text: string) => Promise<void>
}

const buildUserMessage = (text: string): UserMessage => {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    type: 'text',
    status: 'complete',
    data: { text },
    timestamp: new Date(),
  }
}

const buildPendingMessage = (id: string, type: MessageType): Message => {
  return {
    id,
    role: 'bot',
    type,
    status: 'pending',
    timestamp: new Date(),
  }
}

const buildBotCompleteMessage = (
  id: string,
  type: MessageType,
  data: CompleteMessage['data'],
): CompleteMessage => {
  return {
    id,
    role: 'bot',
    type,
    status: 'complete',
    data,
    timestamp: new Date(),
  }
}

const replacePendingMessage = (
  messages: Message[],
  completedId: string,
  completeMessage: CompleteMessage,
): Message[] => {
  return messages.map((message) =>
    message.id === completedId ? completeMessage : message,
  )
}

export const useChat = (
  databaseId: string,
  conversationId: string,
): UseChatResult => {
  const chatService = useMemo(() => new ChatService(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)

  useEffect(() => {
    const abortController = new AbortController()

    setIsLoading(true)
    setIsStreaming(false)
    setMessages([])

    const initialize = async (): Promise<void> => {
      try {
        const initialMessages = await chatService.getDatabaseMessages(
          databaseId,
          conversationId,
          abortController.signal,
        )

        if (!abortController.signal.aborted) {
          setMessages(initialMessages)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      abortController.abort()
    }
  }, [chatService, conversationId, databaseId])

  const sendMessage = async (text: string): Promise<void> => {
    const nextText = text.trim()

    if (!nextText) return

    const userMessage = buildUserMessage(nextText)

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      for await (const chunk of chatService.streamAiResponse(
        userMessage,
        databaseId,
        conversationId,
      )) {
        if (chunk.event === 'incoming') {
          // Thinking phase is over — switch from generic loading to skeleton
          setIsLoading(false)
          setIsStreaming(true)

          const pending = buildPendingMessage(chunk.id, chunk.type)

          const hasPendingMessage = messages.some(
            (message) => message.id === chunk.id,
          )

          if (hasPendingMessage) continue

          setMessages((prev) => [...prev, pending])
        } else if (chunk.event === 'data') {
          const complete = buildBotCompleteMessage(
            chunk.id,
            chunk.type,
            chunk.data,
          )

          setMessages((prev) => {
            const hasPendingMessage = prev.some(
              (message) => message.id === chunk.id,
            )

            if (!hasPendingMessage) {
              return [...prev, complete]
            }

            return replacePendingMessage(prev, chunk.id, complete)
          })
        } else if (chunk.event === 'finished') {
          setIsStreaming(false)
        }
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
  }
}
