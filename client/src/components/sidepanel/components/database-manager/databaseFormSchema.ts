import { z } from 'zod'
import type { DatabaseRecord } from '../../../../types/database'

export const databaseFormSchema = z.object({
  databaseName: z.string().min(1, 'El nombre es requerido'),
  engine: z.string().min(1),
})

export const createDatabaseFormSchema = databaseFormSchema.extend({
  host: z.string().min(1, 'El servidor es requerido'),
  port: z
    .string()
    .min(1, 'El puerto es requerido')
    .refine(
      (val) => {
        const n = Number(val)
        return Number.isInteger(n) && n >= 1 && n <= 65535
      },
      { message: 'Puerto invalido (1-65535)' },
    ),
  database: z.string().min(1, 'El nombre de la base de datos es requerido'),
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contrasena es requerida'),
  useSsl: z.boolean(),
})

export type CreateDatabaseFormState = z.infer<typeof createDatabaseFormSchema>
export type UpdateDatabaseFormState = z.infer<typeof databaseFormSchema>

export const sqlEngineOptions = [
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'Turso DB', value: 'turso' },
  // { label: 'MySQL', value: 'mysql' },
  // { label: 'MariaDB', value: 'mariadb' },
  // { label: 'SQL Server', value: 'sqlserver' },
  // { label: 'SQLite', value: 'sqlite' },
] as const

export const createDatabaseDefaultValues: CreateDatabaseFormState = {
  databaseName: '',
  engine: 'postgresql',
  host: '',
  port: '5432',
  database: '',
  username: '',
  password: '',
  useSsl: true,
}

export const getUpdateDatabaseDefaultValues = (
  database: DatabaseRecord,
): UpdateDatabaseFormState => ({
  databaseName: database.name,
  engine: database.engine,
})
