import { useMemo, useEffect, useRef, useState } from 'react'

import type {
  CompleteMessage,
  Message,
  MessageType,
  PendingMessage,
} from '../types/chat'
import { ChatService } from '../services/chatService'

export interface UseChatResult {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  sendMessage: (text: string) => Promise<void>
}

const buildUserMessage = (text: string): CompleteMessage => {
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

export const useChat = (databaseId: string): UseChatResult => {
  const chatService = useMemo(() => new ChatService(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  // Tracks the id of the current PendingMessage so we can replace it on 'data'
  const pendingIdRef = useRef<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setIsStreaming(false)
    setMessages([])

    const initialize = async (): Promise<void> => {
      try {
        const initialMessages =
          await chatService.getDatabaseMessages(databaseId)

        if (isMounted) {
          setMessages(initialMessages)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      isMounted = false
    }
  }, [chatService, databaseId])

  const sendMessage = async (text: string): Promise<void> => {
    const nextText = text.trim()

    if (!nextText) {
      return
    }

    setMessages((prev) => [...prev, buildUserMessage(nextText)])
    setIsLoading(true)
    pendingIdRef.current = null

    try {
      for await (const chunk of chatService.streamAiResponse(
        nextText,
        databaseId,
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

          const complete: CompleteMessage = {
            id: completedId ?? crypto.randomUUID(),
            role: 'bot',
            type: chunk.type,
            status: 'complete',
            data: chunk.data,
            timestamp: new Date(),
          }

          setMessages((prev) =>
            prev.map((m) => (m.id === completedId ? complete : m)),
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
