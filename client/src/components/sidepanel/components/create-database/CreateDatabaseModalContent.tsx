import { X } from 'lucide-react'
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { useCreateDatabase } from '../../../../hooks/useDatabases'
import type { DatabaseEngine } from '../../../../types/database'
import { InputField } from '../../../ui/InputField'
import { PasswordField } from '../../../ui/PasswordField'
import { SelectField } from '../../../ui/SelectField'
import { ToggleField } from '../../../ui/ToggleField'
import { useCreateConversation } from '../../../../hooks/useConversations'

interface CreateDatabaseModalContentProps {
  onClose: () => void
  onCreationSuccess: (databaseId: string, conversationId: string) => void
}

interface CreateDatabaseFormState {
  databaseName: string
  engine: string
  host: string
  port: string
  database: string
  username: string
  password: string
  useSsl: boolean
}

const initialFormState: CreateDatabaseFormState = {
  databaseName: '',
  engine: 'postgresql',
  host: '',
  port: '5432',
  database: '',
  username: '',
  password: '',
  useSsl: true,
}

const sqlEngineOptions = [
  { label: 'PostgreSQL', value: 'postgresql' },
  // { label: 'MySQL', value: 'mysql' },
  // { label: 'MariaDB', value: 'mariadb' },
  // { label: 'SQL Server', value: 'sqlserver' },
  // { label: 'SQLite', value: 'sqlite' },
] as const

const baseFieldClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)]'

export const CreateDatabaseModalContent = ({
  onClose,
  onCreationSuccess,
}: CreateDatabaseModalContentProps) => {
  const { createDatabase, isPending: isCreatingDatabase } = useCreateDatabase()
  const { createConversation, isPending: isCreatingConversation } =
    useCreateConversation()

  const [formState, setFormState] =
    useState<CreateDatabaseFormState>(initialFormState)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target
    const nextValue =
      event.target instanceof HTMLInputElement &&
      event.target.type === 'checkbox'
        ? event.target.checked
        : value

    setFormState((currentState) => ({
      ...currentState,
      [name]: nextValue,
    }))
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedPort = Number(formState.port)
    if (!Number.isInteger(parsedPort) || parsedPort <= 0) return

    const databaseRecord = await createDatabase({
      name: formState.databaseName.trim(),
      engine: formState.engine as DatabaseEngine,
      connection: {
        host: formState.host.trim(),
        port: parsedPort,
        database: formState.database.trim(),
        username: formState.username.trim(),
        password: formState.password,
        useSsl: formState.useSsl,
      },
    })

    const conversationRecord = await createConversation({
      title: 'Conversacion inicial',
      databaseId: databaseRecord.id,
    })

    onCreationSuccess(databaseRecord.id, conversationRecord.id)
    setFormState(initialFormState)
    onClose()
  }

  const isPending = isCreatingDatabase || isCreatingConversation

  const isSubmitDisabled =
    isPending ||
    formState.databaseName.trim().length === 0 ||
    formState.host.trim().length === 0 ||
    formState.port.trim().length === 0 ||
    formState.database.trim().length === 0 ||
    formState.username.trim().length === 0 ||
    formState.password.trim().length === 0

  return (
    <section className="h-hull relative overflow-hidden">
      <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/35 to-transparent" />

      <div className="grid gap-0">
        <div className="border-b border-zinc-800/90 p-6 md:p-8 lg:border-r lg:border-b-0">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-[0.02em] text-zinc-50">
                  Crear conexion de base de datos
                </h2>
                <p className="max-w-2xl text-xs leading-6 text-zinc-400">
                  Configura los datos de conexion para registrar una base de
                  datos y comenzar a consultar su informacion desde DBTalkie.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950/70 p-2 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-emerald-400/40 hover:text-emerald-200 hover:shadow-[0_0_18px_rgba(52,211,153,0.18)]"
            >
              <X size={24} />
            </button>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Nombre para mostrar"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="databaseName"
                value={formState.databaseName}
                required
                onChange={handleChange}
                placeholder="Almacen de analitica"
              />

              <SelectField
                label="Motor"
                options={sqlEngineOptions}
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                selectClassName={baseFieldClassName}
                name="engine"
                value={formState.engine}
                required
                onChange={handleChange}
              />

              <InputField
                label="Servidor (host)"
                containerClassName="space-y-2 md:col-span-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="host"
                value={formState.host}
                onChange={handleChange}
                required
                placeholder="db.company.internal"
              />

              <InputField
                label="Puerto"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="port"
                value={formState.port}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="5432"
                required
              />

              <InputField
                label="Nombre de la base de datos"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="database"
                value={formState.database}
                onChange={handleChange}
                placeholder="almacen_datos"
                required
              />

              <InputField
                label="Usuario"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="username"
                value={formState.username}
                onChange={handleChange}
                placeholder="usuario_lectura"
                required
              />

              <PasswordField
                label="Contrasena"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
              />
            </div>

            <ToggleField
              label="SSL habilitado"
              description="Usa una conexion cifrada para proteger el trafico entre la aplicacion y tu base de datos."
              name="useSsl"
              checked={formState.useSsl}
              onChange={handleChange}
            />

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800/90 pt-5">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="cursor-pointer rounded-full border border-emerald-400/30 bg-emerald-400/12 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-emerald-200 uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? 'Guardando...' : 'Agregar base de datos'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2.5 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
