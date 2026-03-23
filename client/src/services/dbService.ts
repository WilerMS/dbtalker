import type {
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
