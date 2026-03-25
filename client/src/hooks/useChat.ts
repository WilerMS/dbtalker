import { useMemo, useEffect, useState } from 'react'

import { ChatService } from '../services/chatService'
import type {
  CompleteMessage,
  Message,
  PendingMessage,
  UserMessage,
} from '../types/chat'

export interface UseChatResult {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  sendMessage: (text: string) => Promise<void>
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

    const userMessage: UserMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      status: 'complete',
      data: { text: nextText },
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      for await (const chunk of chatService.streamAiResponse(
        userMessage,
        databaseId,
        conversationId,
      )) {
        if (chunk.event === 'finished') {
          return setIsStreaming(false)
        }

        const baseChunk = { id: chunk.id, type: chunk.type, event: chunk.event }

        if (chunk.event === 'incoming') {
          // Thinking phase is over — switch from generic loading to skeleton
          setIsLoading(false)
          setIsStreaming(true)

          const pending: PendingMessage = {
            ...baseChunk,
            role: 'bot',
            status: 'pending',
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, pending])
        } else if (chunk.event === 'data') {
          setMessages((prev) => {
            const complete: CompleteMessage = {
              ...baseChunk,
              role: 'bot',
              status: 'complete',
              data: chunk.data,
              timestamp: new Date(),
            }

            const hasPending = prev.some((msg) => msg.id === chunk.id)

            if (!hasPending) return [...prev, complete]

            return prev.map((msg) => (msg.id === chunk.id ? complete : msg))
          })
        }
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  return { messages, isLoading, isStreaming, sendMessage }
}
