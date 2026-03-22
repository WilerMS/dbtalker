import type {
  ChatService,
  CompleteMessage,
  PreviewWidgetType,
  SSEChunk,
} from '../types/chat'

const notImplemented = (methodName: keyof ChatService): never => {
  throw new Error(
    `${String(methodName)} is not implemented in chatService.api.ts yet.`,
  )
}

const getInitialMessages = async (
  databaseId: string,
): Promise<CompleteMessage[]> => {
  return notImplemented('getInitialMessages')
}

async function* streamAssistantResponse(
  query: string,
  databaseId: string,
): AsyncGenerator<SSEChunk> {
  notImplemented('streamAssistantResponse')
}

const getPreviewWidget = async (
  widgetType: PreviewWidgetType,
): Promise<CompleteMessage> => {
  return notImplemented('getPreviewWidget')
}

const getPreviewTextMessage = async (): Promise<CompleteMessage> => {
  return notImplemented('getPreviewTextMessage')
}

export const apiChatService: ChatService = {
  getInitialMessages,
  streamAssistantResponse,
  getPreviewWidget,
  getPreviewTextMessage,
}
