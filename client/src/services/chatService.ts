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

interface StreamChatRequestBody {
  message: ApiUserMessage
  database_id: string
  conversation_id: string
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
    signal?: AbortSignal,
  ): Promise<CompleteMessage[]> {
    const url = this.buildDatabaseMessagesUrl(databaseId, conversationId)
    const response = await fetch(url, { signal })

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
  ): AsyncGenerator<SSEChunk> {
    const url = new URL(`${this.apiBaseUrl}/chat/stream`)
    const abortController = new AbortController()
    const state = this.createStreamState()
    const requestBody = this.buildStreamRequestBody(
      userMessage,
      databaseId,
      conversationId,
    )

    const streamRequest = fetchEventSource(url.toString(), {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      onmessage: (event) => {
        this.handleMessageEvent(event.data, state, abortController)
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
      if (abortController.signal.aborted && state.isStreamDone) {
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
      abortController.abort()
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

  private buildStreamRequestBody(
    userMessage: UserMessage,
    databaseId: string,
    conversationId: string,
  ): StreamChatRequestBody {
    return {
      message: this.toApiUserMessage(userMessage),
      database_id: databaseId,
      conversation_id: conversationId,
    }
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

  private createStreamState(): StreamState {
    return {
      queue: [],
      notifyNextChunk: null,
      isStreamDone: false,
      streamError: null,
    }
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

  private handleMessageEvent(
    rawData: string,
    state: StreamState,
    abortController: AbortController,
  ): void {
    try {
      const chunk = this.parseChunk(rawData)
      this.pushChunk(state, chunk)

      if (chunk.event === 'finished') {
        this.finishStream(state)
        abortController.abort()
      }
    } catch (error) {
      this.handleStreamFailure(error, state, 'Unexpected SSE parse error.')
      abortController.abort()
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
