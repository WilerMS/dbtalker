import type {
  CreateDatabaseInput,
  DatabaseRecord,
  UpdateDatabaseInput,
} from '../types/database'

const waitForLatency = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
}

let databases: DatabaseRecord[] = [
  {
    id: 'db-postgres',
    name: 'PostgreSQL',
    engine: 'postgresql',
    description: 'Operational commerce data',
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-01-10T10:00:00.000Z'),
  },
  {
    id: 'db-mongodb',
    name: 'MongoDB',
    engine: 'mongodb',
    description: 'Event stream and audit logs',
    createdAt: new Date('2026-01-12T14:00:00.000Z'),
    updatedAt: new Date('2026-01-12T14:00:00.000Z'),
  },
  {
    id: 'db-sqlite',
    name: 'SQLite',
    engine: 'sqlite',
    description: 'Local analytics snapshot',
    createdAt: new Date('2026-01-14T09:00:00.000Z'),
    updatedAt: new Date('2026-01-14T09:00:00.000Z'),
  },
]

const cloneDatabase = (database: DatabaseRecord): DatabaseRecord => {
  return {
    ...database,
    createdAt: new Date(database.createdAt),
    updatedAt: new Date(database.updatedAt),
  }
}

const buildDatabaseId = (name: string): string => {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const fallbackId = `db-${crypto.randomUUID().slice(0, 8)}`

  if (!normalized) {
    return fallbackId
  }

  const prefixedId = normalized.startsWith('db-')
    ? normalized
    : `db-${normalized}`

  const alreadyExists = databases.some((database) => database.id === prefixedId)

  return alreadyExists
    ? `${prefixedId}-${crypto.randomUUID().slice(0, 4)}`
    : prefixedId
}

export const listDatabases = async (): Promise<DatabaseRecord[]> => {
  await waitForLatency()

  return databases.map(cloneDatabase)
}

export const getDatabaseById = async (
  id: string,
): Promise<DatabaseRecord | null> => {
  await waitForLatency()

  const database = databases.find(
    (currentDatabase) => currentDatabase.id === id,
  )

  return database ? cloneDatabase(database) : null
}

export const createDatabase = async (
  input: CreateDatabaseInput,
): Promise<DatabaseRecord> => {
  await waitForLatency()

  const now = new Date()
  const createdDatabase: DatabaseRecord = {
    id: buildDatabaseId(input.name),
    name: input.name,
    engine: input.engine,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  }

  databases = [...databases, createdDatabase]

  return cloneDatabase(createdDatabase)
}

export const updateDatabase = async (
  id: string,
  input: UpdateDatabaseInput,
): Promise<DatabaseRecord | null> => {
  await waitForLatency()

  const databaseIndex = databases.findIndex((database) => database.id === id)

  if (databaseIndex === -1) {
    return null
  }

  const currentDatabase = databases[databaseIndex]
  const updatedDatabase: DatabaseRecord = {
    ...currentDatabase,
    ...input,
    updatedAt: new Date(),
  }

  databases = [
    ...databases.slice(0, databaseIndex),
    updatedDatabase,
    ...databases.slice(databaseIndex + 1),
  ]

  return cloneDatabase(updatedDatabase)
}

export const deleteDatabase = async (id: string): Promise<boolean> => {
  await waitForLatency()

  const previousLength = databases.length
  databases = databases.filter((database) => database.id !== id)

  return databases.length < previousLength
}
