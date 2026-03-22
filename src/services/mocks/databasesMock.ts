import type { Message } from '../../types/chat'
import type { DatabaseRecord } from '../../types/database'
import { buildMockInitialMessages } from './chatMockData'

/**
 * DatabaseWithMessages extends DatabaseRecord to include an associated message history.
 * This is an internal mock structure — not exposed in the public API.
 */
interface DatabaseWithMessages extends DatabaseRecord {
  messages: Message[]
}

/**
 * Internal in-memory store for databases and their chat messages.
 * This structure persists only during the current session.
 */
const databasesWithMessages: DatabaseWithMessages[] = [
  {
    id: 'db-postgres',
    name: 'PostgreSQL',
    engine: 'postgresql',
    description: 'Operational commerce data',
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-01-10T10:00:00.000Z'),
    messages: buildMockInitialMessages('db-postgres'),
  },
  {
    id: 'db-mongodb',
    name: 'MongoDB',
    engine: 'mongodb',
    description: 'Event stream and audit logs',
    createdAt: new Date('2026-01-12T14:00:00.000Z'),
    updatedAt: new Date('2026-01-12T14:00:00.000Z'),
    messages: buildMockInitialMessages('db-mongodb'),
  },
  {
    id: 'db-sqlite',
    name: 'SQLite',
    engine: 'sqlite',
    description: 'Local analytics snapshot',
    createdAt: new Date('2026-01-14T09:00:00.000Z'),
    updatedAt: new Date('2026-01-14T09:00:00.000Z'),
    messages: buildMockInitialMessages('db-sqlite'),
  },
]

/**
 * Internal function: Get all messages for a given database.
 * @param databaseId - The database ID to retrieve messages for
 * @returns Array of messages, or empty array if database not found
 */
export const getMessagesForDatabase = (databaseId: string): Message[] => {
  const database = databasesWithMessages.find((db) => db.id === databaseId)
  return database ? [...database.messages] : []
}

/**
 * Internal function: Add a message to a specific database's message history.
 * @param databaseId - The database ID to add the message to
 * @param message - The message to add
 */
export const addMessageToDatabase = (
  databaseId: string,
  message: Message,
): void => {
  const database = databasesWithMessages.find((db) => db.id === databaseId)
  if (database) {
    database.messages = [...database.messages, message]
  }
}

/**
 * Internal function: Get a database record (without messages).
 * Used internally by the mock layer.
 */
export const getDatabase = (databaseId: string): DatabaseRecord | null => {
  const database = databasesWithMessages.find((db) => db.id === databaseId)
  return database || null
}

/**
 * Internal function: List all database records (without messages).
 * Used internally by the mock layer.
 */
export const getDatabases = (): DatabaseRecord[] => {
  return databasesWithMessages.map((db) => ({
    id: db.id,
    name: db.name,
    engine: db.engine,
    description: db.description,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  }))
}
