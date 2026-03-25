import { useMemo, useEffect, useRef, useState } from 'react'

import type {
  CompleteMessage,
  Message,
  MessageType,
  PendingMessage,
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

const buildPendingMessage = (type: MessageType): PendingMessage => {
  return {
    id: crypto.randomUUID(),
    role: 'bot',
    type,
    status: 'pending',
    timestamp: new Date(),
  }
}

const buildBotCompleteMessage = (
  type: MessageType,
  data: CompleteMessage['data'],
  completedId: string | null,
): CompleteMessage => {
  return {
    id: completedId ?? crypto.randomUUID(),
    role: 'bot',
    type,
    status: 'complete',
    data,
    timestamp: new Date(),
  }
}

const replacePendingMessage = (
  messages: Message[],
  completedId: string | null,
  completeMessage: CompleteMessage,
): Message[] => {
  if (!completedId) {
    return [...messages, completeMessage]
  }

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
  // Tracks the id of the current PendingMessage so we can replace it on 'data'
  const pendingIdRef = useRef<string | null>(null)

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
    pendingIdRef.current = null

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

          const pending = buildPendingMessage(chunk.type)
          pendingIdRef.current = pending.id
          setMessages((prev) => [...prev, pending])
        } else if (chunk.event === 'data') {
          // Replace the pending skeleton with the real complete message
          const completedId = pendingIdRef.current
          pendingIdRef.current = null

          const complete = buildBotCompleteMessage(
            chunk.type,
            chunk.data,
            completedId,
          )

          setMessages((prev) =>
            replacePendingMessage(prev, completedId, complete),
          )
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
