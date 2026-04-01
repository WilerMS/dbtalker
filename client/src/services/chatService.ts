import type {
  CompleteMessage,
  MessageData,
  MessageType,
  SSEChunk,
  UserMessage,
} from '../types/chat'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://172.31.240.184:8000'

interface ApiCompleteMessage {
  id: string
  role: 'user' | 'bot'
  type: MessageType
  status: 'complete'
  data: MessageData
  timestamp: string
}

interface ApiUserMessage {
  id: string
  role: 'user'
  type: 'text'
  status: 'complete'
  data: {
    text: string
  }
  timestamp: string
}

interface StreamState {
  queue: SSEChunk[]
  notifyNextChunk: (() => void) | null
  isStreamDone: boolean
  streamError: Error | null
}

export class ChatService {
  private readonly apiBaseUrl: string

  constructor(apiBaseUrl: string = API_BASE_URL) {
    this.apiBaseUrl = apiBaseUrl
  }

  public async getDatabaseMessages(
    databaseId: string,
    conversationId: string,
    token?: string,
    signal?: AbortSignal,
  ): Promise<CompleteMessage[]> {
    const url = this.buildDatabaseMessagesUrl(databaseId, conversationId)
    const response = await fetch(url, {
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to load chat messages. Status: ${response.status} ${response.statusText}`,
      )
    }

    const payload = (await response.json()) as ApiCompleteMessage[]
    return payload.map((message) => this.toCompleteMessage(message))
  }

  public async *streamAiResponse(
    userMessage: UserMessage,
    databaseId: string,
    conversationId: string,
    signal: AbortSignal,
    token?: string,
  ): AsyncGenerator<SSEChunk> {
    const url = new URL(
      `${this.apiBaseUrl}/chat/stream?database_id=${databaseId}&conversation_id=${conversationId}`,
    )
    const state: StreamState = {
      queue: [],
      notifyNextChunk: null,
      isStreamDone: false,
      streamError: null,
    }
    const requestBody = {
      message: this.toApiUserMessage(userMessage),
      database_id: databaseId,
      conversation_id: conversationId,
    }

    // Setup abort handler to wake up the reader if waiting
    const abortHandler = () => {
      this.wakeUpReader(state)
    }
    signal.addEventListener('abort', abortHandler)

    const streamRequest = fetchEventSource(url.toString(), {
      method: 'POST',
      signal,
      openWhenHidden: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestBody),
      onmessage: (event) => {
        this.handleMessageEvent(event.data, state)
      },
      onerror: (error) => {
        if (state.isStreamDone) {
          return
        }

        throw this.handleStreamFailure(
          error,
          state,
          'SSE stream connection was interrupted.',
        )
      },
      onclose: () => {
        this.finishStream(state)
      },
    }).catch((error) => {
      if (signal.aborted && state.isStreamDone) {
        return
      }

      this.handleStreamFailure(
        error,
        state,
        'SSE stream connection was interrupted.',
      )
    })

    try {
      while (!state.isStreamDone || state.queue.length > 0) {
        // If signal was aborted externally, stop immediately
        if (signal.aborted) {
          break
        }

        if (state.queue.length === 0) {
          await this.waitForNextChunk(state)
        }

        if (state.streamError) {
          throw state.streamError
        }

        while (state.queue.length > 0) {
          const chunk = state.queue.shift()

          if (!chunk) {
            continue
          }

          yield chunk
        }
      }
    } finally {
      signal.removeEventListener('abort', abortHandler)
      await streamRequest
    }
  }

  private buildDatabaseMessagesUrl(
    databaseId: string,
    conversationId: string,
  ): URL {
    const url = new URL(`${this.apiBaseUrl}/chat/messages`)
    url.searchParams.set('database_id', databaseId)
    url.searchParams.set('conversation_id', conversationId)
    return url
  }

  private toCompleteMessage(message: ApiCompleteMessage): CompleteMessage {
    return {
      ...message,
      timestamp: new Date(message.timestamp),
    }
  }

  private toApiUserMessage(message: UserMessage): ApiUserMessage {
    return {
      ...message,
      timestamp: message.timestamp.toISOString(),
    }
  }

  private parseChunk(rawData: string): SSEChunk {
    const chunk = JSON.parse(rawData) as unknown

    if (typeof chunk !== 'object' || chunk === null || !('event' in chunk)) {
      throw new Error('Malformed SSE chunk from server.')
    }

    if (chunk.event === 'finished') {
      return { event: 'finished' }
    }

    if (
      (chunk.event === 'incoming' || chunk.event === 'data') &&
      'id' in chunk &&
      typeof chunk.id === 'string' &&
      'type' in chunk &&
      typeof chunk.type === 'string'
    ) {
      if (chunk.event === 'incoming') {
        return {
          id: chunk.id,
          event: 'incoming',
          type: chunk.type as MessageType,
        }
      }

      if ('data' in chunk) {
        return {
          id: chunk.id,
          event: 'data',
          type: chunk.type as MessageType,
          data: chunk.data as MessageData,
        }
      }
    }

    throw new Error('Invalid SSE chunk shape received from server.')
  }

  private waitForNextChunk(state: StreamState): Promise<void> {
    return new Promise<void>((resolve) => {
      state.notifyNextChunk = resolve
    })
  }

  private wakeUpReader(state: StreamState): void {
    if (!state.notifyNextChunk) {
      return
    }

    state.notifyNextChunk()
    state.notifyNextChunk = null
  }

  private pushChunk(state: StreamState, chunk: SSEChunk): void {
    state.queue.push(chunk)
    this.wakeUpReader(state)
  }

  private finishStream(state: StreamState): void {
    state.isStreamDone = true
    this.wakeUpReader(state)
  }

  private handleMessageEvent(rawData: string, state: StreamState): void {
    try {
      const chunk = this.parseChunk(rawData)
      this.pushChunk(state, chunk)

      if (chunk.event === 'finished') {
        this.finishStream(state)
      }
    } catch (error) {
      this.handleStreamFailure(error, state, 'Unexpected SSE parse error.')
    }
  }

  private handleStreamFailure(
    error: unknown,
    state: StreamState,
    fallbackMessage: string,
  ): Error {
    const normalizedError =
      error instanceof Error ? error : new Error(fallbackMessage)

    state.streamError = normalizedError
    this.finishStream(state)
    return normalizedError
  }
}
