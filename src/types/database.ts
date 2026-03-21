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
