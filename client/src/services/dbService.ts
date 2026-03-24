import type {
  ConversationRecord,
  CreateConversationInput,
  CreateDatabaseInput,
  DatabaseRecord,
  UpdateDatabaseInput,
} from '../types/database'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

interface ApiDatabaseRecord {
  id: string
  name: string
  engine: DatabaseRecord['engine']
  description?: string
  created_at: string
  updated_at: string
}

interface ApiConversationRecord {
  id: string
  database_id: string
  title: string
  created_at: string
  updated_at: string
}

const mapDatabaseRecord = (database: ApiDatabaseRecord): DatabaseRecord => {
  return {
    id: database.id,
    name: database.name,
    engine: database.engine,
    description: database.description,
    createdAt: new Date(database.created_at),
    updatedAt: new Date(database.updated_at),
  }
}

const mapConversationRecord = (
  conversation: ApiConversationRecord,
): ConversationRecord => {
  return {
    id: conversation.id,
    database_id: conversation.database_id,
    title: conversation.title,
    created_at: new Date(conversation.created_at),
    updated_at: new Date(conversation.updated_at),
  }
}

export const listDatabases = async (): Promise<DatabaseRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/databases`)
  if (!response.ok) {
    throw new Error(
      `Failed to list databases. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiDatabaseRecord[]
  return payload.map(mapDatabaseRecord)
}

export const getDatabaseById = async (
  id: string,
): Promise<DatabaseRecord | null> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load database '${id}'. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiDatabaseRecord
  return mapDatabaseRecord(payload)
}

export const createDatabase = async (
  input: CreateDatabaseInput,
): Promise<DatabaseRecord> => {
  const response = await fetch(`${API_BASE_URL}/databases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to create database. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiDatabaseRecord
  return mapDatabaseRecord(payload)
}

export const updateDatabase = async (
  id: string,
  input: UpdateDatabaseInput,
): Promise<DatabaseRecord | null> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Failed to update database '${id}'. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiDatabaseRecord
  return mapDatabaseRecord(payload)
}

export const deleteDatabase = async (id: string): Promise<boolean> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  )

  if (response.status === 404) {
    return false
  }

  if (!response.ok) {
    throw new Error(
      `Failed to delete database '${id}'. Status: ${response.status} ${response.statusText}`,
    )
  }

  return true
}

export const getConversationsByDatabaseId = async (
  databaseId: string,
): Promise<ConversationRecord[]> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(databaseId)}/conversations`,
  )

  if (!response.ok) {
    throw new Error(
      `Failed to load conversations for database '${databaseId}'. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiConversationRecord[]
  return payload.map(mapConversationRecord)
}

export const createConversation = async (
  databaseId: string,
  input: CreateConversationInput,
): Promise<ConversationRecord> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(databaseId)}/conversations`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Failed to create conversation. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiConversationRecord
  return mapConversationRecord(payload)
}
