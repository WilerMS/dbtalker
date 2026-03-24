export type DatabaseEngine = 'postgresql' | 'mongodb' | 'sqlite'

export interface DatabaseRecord {
  id: string
  name: string
  engine: DatabaseEngine
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateDatabaseInput {
  name: string
  engine: DatabaseEngine
  description?: string
}

export interface UpdateDatabaseInput {
  name?: string
  engine?: DatabaseEngine
  description?: string
}

export interface ConversationRecord {
  id: string
  database_id: string
  title: string
  created_at: Date
  updated_at: Date
}

export interface CreateConversationInput {
  title: string
}
