import { useAuth } from '@clerk/react'
import { useMemo, useEffect, useEffectEvent, useState, useRef } from 'react'

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
  const streamAbortControllerRef = useRef<AbortController | null>(null)
  const { getToken } = useAuth()

  const initializeChat = useEffectEvent(async (signal: AbortSignal) => {
    const token = (await getToken()) ?? undefined

    setIsLoading(true)
    setIsStreaming(false)
    setMessages([])

    try {
      const initialMessages = await chatService.getDatabaseMessages(
        databaseId,
        conversationId,
        token,
        signal,
      )

      if (!signal.aborted) setMessages(initialMessages)
    } finally {
      if (!signal.aborted) setIsLoading(false)
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    void initializeChat(abortController.signal)

    return () => {
      abortController.abort()
      if (streamAbortControllerRef.current) {
        streamAbortControllerRef.current.abort()
        streamAbortControllerRef.current = null
      }
    }
  }, [conversationId, databaseId])

  const sendMessage = async (text: string): Promise<void> => {
    const token = (await getToken()) ?? undefined
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

    const streamController = new AbortController()
    streamAbortControllerRef.current = streamController

    try {
      for await (const chunk of chatService.streamAiResponse(
        userMessage,
        databaseId,
        conversationId,
        streamController.signal,
        token,
      )) {
        if (streamController.signal.aborted) {
          return
        }

        if (chunk.event === 'finished') {
          streamAbortControllerRef.current = null
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
      streamAbortControllerRef.current = null
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  return { messages, isLoading, isStreaming, sendMessage }
}
