export type MessageRole = 'user' | 'bot'
export type MessageType = 'text' | 'schema' | 'kpi' | 'bar' | 'line' | 'table'
export type PreviewWidgetType = Exclude<MessageType, 'text'>

export interface TextData {
  text: string
}

export interface SchemaColumn {
  name: string
  type: string
  isPrimaryKey?: boolean
}

export interface SchemaNodeData {
  label: string
  columns: SchemaColumn[]
}

export interface SchemaNode {
  id: string
  position: {
    x: number
    y: number
  }
  data: SchemaNodeData
}

export interface SchemaEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface SchemaData {
  title: string
  nodes: SchemaNode[]
  edges: SchemaEdge[]
}

export interface KpiData {
  value: string | number
  label: string
  delta?: string
}

export interface BarData {
  labels: string[]
  values: number[]
  title?: string
}

export interface LinePoint {
  x: string
  y: number
}

export interface LineData {
  points: LinePoint[]
  title?: string
}

export interface TableRow {
  [key: string]: string | number
}

export interface TableData {
  columns: string[]
  rows: TableRow[]
}

export type MessageData =
  | TextData
  | SchemaData
  | KpiData
  | BarData
  | LineData
  | TableData

export interface PendingMessage {
  id: string
  role: MessageRole
  type: MessageType
  status: 'pending'
  timestamp: Date
}

export interface CompleteMessage {
  id: string
  role: MessageRole
  type: MessageType
  status: 'complete'
  data: MessageData
  timestamp: Date
}

export type Message = PendingMessage | CompleteMessage

// SSE chunk types emitted by the mock streaming service
export interface SSEChunkIncoming {
  event: 'incoming'
  type: MessageType
}

export interface SSEChunkData {
  event: 'data'
  type: MessageType
  data: MessageData
}

export interface SSEChunkFinished {
  event: 'finished'
}

export type SSEChunk = SSEChunkIncoming | SSEChunkData | SSEChunkFinished
