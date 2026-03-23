import type {
  ChatService,
  CompleteMessage,
  MessageData,
  MessageType,
  SSEChunk,
} from '../types/chat'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

interface ApiCompleteMessage {
  id: string
  role: 'user' | 'bot'
  type: MessageType
  status: 'complete'
  data: MessageData
  timestamp: string
}

const toCompleteMessage = (message: ApiCompleteMessage): CompleteMessage => {
  return {
    ...message,
    timestamp: new Date(message.timestamp),
  }
}

const parseChunk = (rawData: string): SSEChunk => {
  const chunk = JSON.parse(rawData) as unknown

  if (typeof chunk !== 'object' || chunk === null || !('event' in chunk)) {
    throw new Error('Malformed SSE chunk from server.')
  }

  if (chunk.event === 'finished') return { event: 'finished' }

  if (
    (chunk.event === 'incoming' || chunk.event === 'data') &&
    'type' in chunk &&
    typeof chunk.type === 'string'
  ) {
    if (chunk.event === 'incoming') {
      return {
        event: 'incoming',
        type: chunk.type as MessageType,
      }
    }

    if ('data' in chunk) {
      return {
        event: 'data',
        type: chunk.type as MessageType,
        data: chunk.data as MessageData,
      }
    }
  }

  throw new Error('Invalid SSE chunk shape received from server.')
}

const getInitialMessages = async (
  databaseId: string,
): Promise<CompleteMessage[]> => {
  const url = new URL(`${API_BASE_URL}/chat/messages`)
  url.searchParams.set('database_id', databaseId)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to load chat messages. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiCompleteMessage[]
  return payload.map(toCompleteMessage)
}

async function* streamAssistantResponse(
  query: string,
  databaseId: string,
): AsyncGenerator<SSEChunk> {
  const url = new URL(`${API_BASE_URL}/chat/stream`)
  url.searchParams.set('query', query)
  url.searchParams.set('database_id', databaseId)

  const abortController = new AbortController()
  const queue: SSEChunk[] = []

  let notifyNextChunk: (() => void) | null = null
  let isStreamDone = false
  let streamError: Error | null = null

  const wakeUpReader = (): void => {
    if (!notifyNextChunk) {
      return
    }

    notifyNextChunk()
    notifyNextChunk = null
  }

  const pushChunk = (chunk: SSEChunk): void => {
    queue.push(chunk)
    wakeUpReader()
  }

  const streamRequest = fetchEventSource(url.toString(), {
    method: 'GET',
    signal: abortController.signal,
    onmessage: (event) => {
      try {
        const chunk = parseChunk(event.data)
        pushChunk(chunk)

        if (chunk.event === 'finished') {
          isStreamDone = true
          abortController.abort()
          wakeUpReader()
        }
      } catch (error) {
        streamError =
          error instanceof Error
            ? error
            : new Error('Unexpected SSE parse error.')
        isStreamDone = true
        abortController.abort()
        wakeUpReader()
      }
    },
    onerror: (error) => {
      if (isStreamDone) {
        return
      }

      streamError =
        error instanceof Error
          ? error
          : new Error('SSE stream connection was interrupted.')
      isStreamDone = true
      wakeUpReader()

      throw streamError
    },
    onclose: () => {
      isStreamDone = true
      wakeUpReader()
    },
  }).catch((error) => {
    if (abortController.signal.aborted && isStreamDone) {
      return
    }

    streamError =
      error instanceof Error
        ? error
        : new Error('SSE stream connection was interrupted.')
    isStreamDone = true
    wakeUpReader()
  })

  try {
    while (!isStreamDone || queue.length > 0) {
      if (queue.length === 0) {
        await new Promise<void>((resolve) => {
          notifyNextChunk = resolve
        })
      }

      if (streamError) {
        throw streamError
      }

      while (queue.length > 0) {
        const chunk = queue.shift()

        if (!chunk) {
          continue
        }

        yield chunk
      }
    }
  } finally {
    abortController.abort()
    await streamRequest
  }
}

export const apiChatService: ChatService = {
  getInitialMessages,
  streamAssistantResponse,
}
