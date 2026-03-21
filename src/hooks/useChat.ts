import { useEffect, useState } from 'react'

import {
  getAssistantResponse,
  getInitialMessages,
  getPreviewTextMessage,
  getPreviewWidget,
} from '../services/chatService'
import type { Message, MessageType, PreviewWidgetType } from '../types/chat'

export interface UseChatResult {
  messages: Message[]
  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
  injectWidget: (type: MessageType) => Promise<void>
}

const buildUserMessage = (text: string): Message => {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    type: 'text',
    data: { text },
    timestamp: new Date(),
  }
}

const isPreviewWidgetType = (type: MessageType): type is PreviewWidgetType => {
  return type !== 'text'
}

export const useChat = (databaseId: string): UseChatResult => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setMessages([])

    const initialize = async (): Promise<void> => {
      try {
        const initialMessages = await getInitialMessages(databaseId)

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
  }, [databaseId])

  const sendMessage = async (text: string): Promise<void> => {
    const nextText = text.trim()

    if (!nextText) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      buildUserMessage(nextText),
    ])
    setIsLoading(true)

    try {
      const responseMessage = await getAssistantResponse(nextText, databaseId)

      setMessages((currentMessages) => [...currentMessages, responseMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const injectWidget = async (type: MessageType): Promise<void> => {
    setIsLoading(true)

    try {
      const widgetMessage = isPreviewWidgetType(type)
        ? await getPreviewWidget(type)
        : await getPreviewTextMessage()

      setMessages((currentMessages) => [...currentMessages, widgetMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    injectWidget,
  }
}
