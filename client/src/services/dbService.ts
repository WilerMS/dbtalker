import type {
  ConversationRecord,
  CreateConversationInput,
  CreateDatabaseInput,
  DatabaseRecord,
  UpdateDatabaseInput,
} from '../types/database'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://172.31.240.184:8000'

interface ApiDatabaseRecord {
  id: string
  name: string
  engine: DatabaseRecord['engine']
  icon: string
  description?: string
  created_at: string
  updated_at: string
}

interface ApiCreateDatabaseInput {
  name: string
  engine: DatabaseRecord['engine']
  description?: string
  connection: {
    host: string
    port: number
    database: string
    username: string
    password: string
    use_ssl: boolean
  }
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
    icon: database.icon,
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
    createdAt: new Date(conversation.created_at),
    updatedAt: new Date(conversation.updated_at),
  }
}

export const listDatabases = async (
  token?: string,
): Promise<DatabaseRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/databases`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
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
  token?: string,
): Promise<DatabaseRecord | null> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
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

export const getDemoDatabase = async (): Promise<DatabaseRecord | null> => {
  const response = await fetch(`${API_BASE_URL}/databases/demo`)

  if (response.status === 404) return null

  if (!response.ok) {
    throw new Error(
      `Failed to load demo database. Status: ${response.status} ${response.statusText}`,
    )
  }

  const payload = (await response.json()) as ApiDatabaseRecord
  return mapDatabaseRecord(payload)
}

export const createDatabase = async (
  input: CreateDatabaseInput,
  token?: string,
): Promise<DatabaseRecord> => {
  const requestBody: ApiCreateDatabaseInput = {
    name: input.name,
    engine: input.engine,
    description: input.description,
    connection: {
      host: input.connection.host,
      port: input.connection.port,
      database: input.connection.database,
      username: input.connection.username,
      password: input.connection.password,
      use_ssl: input.connection.useSsl,
    },
  }

  const response = await fetch(`${API_BASE_URL}/databases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
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
  token?: string,
): Promise<DatabaseRecord | null> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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

export const deleteDatabase = async (
  id: string,
  token?: string,
): Promise<boolean> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
  token?: string,
): Promise<ConversationRecord[]> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(databaseId)}/conversations`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
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
  token?: string,
): Promise<ConversationRecord> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(databaseId)}/conversations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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

export const deleteConversation = async (
  databaseId: string,
  conversationId: string,
  token?: string,
): Promise<boolean> => {
  const response = await fetch(
    `${API_BASE_URL}/databases/${encodeURIComponent(databaseId)}/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  )

  if (response.status === 404) {
    return false
  }

  if (!response.ok) {
    throw new Error(
      `Failed to delete conversation '${conversationId}'. Status: ${response.status} ${response.statusText}`,
    )
  }

  return true
}
