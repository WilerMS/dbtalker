import type {
  ChatService,
  CompleteMessage,
  Message,
  PreviewWidgetType,
  SSEChunk,
} from '../../types/chat'
import {
  buildMockPreviewTextMessage,
  buildMockStreamingTextData,
  buildMockWidgetMessage,
  detectMockWidgetType,
} from './chatMockData'
import { addMessageToDatabase, getMessagesForDatabase } from './databasesMock'

const waitForLatency = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
}

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const getInitialMessages = async (
  databaseId: string,
): Promise<CompleteMessage[]> => {
  await waitForLatency()

  const messages = getMessagesForDatabase(databaseId)
  return messages.filter(
    (msg): msg is CompleteMessage => msg.status === 'complete',
  )
}

async function* streamAssistantResponse(
  query: string,
  databaseId: string,
): AsyncGenerator<SSEChunk> {
  // Build and save user message immediately
  const userMessage: CompleteMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    type: 'text',
    status: 'complete',
    data: { text: query },
    timestamp: new Date(),
  }
  addMessageToDatabase(databaseId, userMessage)

  await wait(900)

  const widgetType = detectMockWidgetType(query)

  yield { event: 'incoming', type: 'text' }
  await wait(700)

  const textData = buildMockStreamingTextData(widgetType, databaseId)
  yield {
    event: 'data',
    type: 'text',
    data: textData,
  }
  await wait(500)

  // Track widget data if a widget will be generated
  let widgetData: Message | null = null

  if (widgetType) {
    yield { event: 'incoming', type: widgetType }
    await wait(800)

    const widgetMessage = buildMockWidgetMessage(widgetType)
    widgetData = widgetMessage
    yield { event: 'data', type: widgetType, data: widgetMessage.data }
    await wait(200)
  }

  yield { event: 'finished' }

  // Save bot messages after streaming completes
  const textMessage: CompleteMessage = {
    id: crypto.randomUUID(),
    role: 'bot',
    type: 'text',
    status: 'complete',
    data: textData,
    timestamp: new Date(),
  }
  addMessageToDatabase(databaseId, textMessage)

  if (widgetData) {
    addMessageToDatabase(databaseId, widgetData)
  }
}

const getPreviewWidget = async (
  widgetType: PreviewWidgetType,
): Promise<CompleteMessage> => {
  await waitForLatency()

  return buildMockWidgetMessage(widgetType)
}

const getPreviewTextMessage = async (): Promise<CompleteMessage> => {
  await waitForLatency()

  return buildMockPreviewTextMessage()
}

export const mockChatService: ChatService = {
  getInitialMessages,
  streamAssistantResponse,
  getPreviewWidget,
  getPreviewTextMessage,
}
