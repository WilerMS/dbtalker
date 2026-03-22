import type {
  CompleteMessage,
  PreviewWidgetType,
  SSEChunk,
} from '../types/chat'
import {
  buildMockInitialMessages,
  buildMockPreviewTextMessage,
  buildMockStreamingTextData,
  buildMockWidgetMessage,
  detectMockWidgetType,
} from './mocks/chatMockData'

const waitForLatency = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
}

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const getInitialMessages = async (
  databaseId: string,
): Promise<CompleteMessage[]> => {
  await waitForLatency()

  return buildMockInitialMessages(databaseId)
}

export async function* streamAssistantResponse(
  query: string,
  databaseId: string,
): AsyncGenerator<SSEChunk> {
  // Phase 1: thinking delay — caller shows <LoadingMessage /> during this
  await wait(900)

  const widgetType = detectMockWidgetType(query)

  // Always emit a text message first
  yield { event: 'incoming', type: 'text' }
  await wait(700)

  yield {
    event: 'data',
    type: 'text',
    data: buildMockStreamingTextData(widgetType, databaseId),
  }
  await wait(500)

  // If a widget was requested, stream it after the text
  if (widgetType) {
    yield { event: 'incoming', type: widgetType }
    await wait(800)

    const widgetMessage = buildMockWidgetMessage(widgetType)
    yield { event: 'data', type: widgetType, data: widgetMessage.data }
    await wait(200)
  }

  yield { event: 'finished' }
}

export const getPreviewWidget = async (
  widgetType: PreviewWidgetType,
): Promise<CompleteMessage> => {
  await waitForLatency()

  return buildMockWidgetMessage(widgetType)
}

export const getPreviewTextMessage = async (): Promise<CompleteMessage> => {
  await waitForLatency()

  return buildMockPreviewTextMessage()
}
