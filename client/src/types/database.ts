export type DatabaseEngine = 'postgresql' | 'mongodb' | 'sqlite'

export interface DatabaseRecord {
  id: string
  name: string
  engine: DatabaseEngine
  icon: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseConnectionInput {
  host: string
  port: number
  database: string
  username: string
  password: string
  useSsl: boolean
}

export interface CreateDatabaseInput {
  name: string
  engine: DatabaseEngine
  description?: string
  connection: DatabaseConnectionInput
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
  createdAt: Date
  updatedAt: Date
}

export interface CreateConversationInput {
  title: string
}
