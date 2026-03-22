import type { ChatService } from '../types/chat'
import { apiChatService } from './chatService.api'
import { mockChatService } from './mocks/chatService.mock'

const chatServiceImplementations = {
  api: apiChatService,
  mock: mockChatService,
} satisfies Record<string, ChatService>

const chatService: ChatService = chatServiceImplementations.mock

export const getInitialMessages = chatService.getInitialMessages
export const streamAssistantResponse = chatService.streamAssistantResponse
export const getPreviewWidget = chatService.getPreviewWidget
export const getPreviewTextMessage = chatService.getPreviewTextMessage
