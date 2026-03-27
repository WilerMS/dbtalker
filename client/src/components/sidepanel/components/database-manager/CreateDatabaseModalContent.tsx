import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCreateConversation } from '../../../../hooks/useConversations'
import { useCreateDatabase } from '../../../../hooks/useDatabases'
import type { DatabaseEngine } from '../../../../types/database'
import { InputField } from '../../../ui/InputField'
import { LoadingState } from '../../../ui/LoadingState'
import { PasswordField } from '../../../ui/PasswordField'
import { SelectField } from '../../../ui/SelectField'
import { ToggleField } from '../../../ui/ToggleField'
import {
  createDatabaseDefaultValues,
  createDatabaseFormSchema,
  sqlEngineOptions,
  type CreateDatabaseFormState,
} from './databaseFormSchema'

interface CreateDatabaseModalContentProps {
  onClose: () => void
  onCreationSuccess: (database_id: string, conversationId: string) => void
}

export const CreateDatabaseModalContent = ({
  onClose,
  onCreationSuccess,
}: CreateDatabaseModalContentProps) => {
  const { createDatabase, isPending: isCreatingDatabase } = useCreateDatabase()
  const { createConversation, isPending: isCreatingConversation } =
    useCreateConversation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateDatabaseFormState>({
    resolver: zodResolver(createDatabaseFormSchema),
    mode: 'onTouched',
    defaultValues: createDatabaseDefaultValues,
  })

  const isPending = isCreatingDatabase || isCreatingConversation

  const onSubmit = async (data: CreateDatabaseFormState) => {
    const databaseRecord = await createDatabase({
      name: data.databaseName.trim(),
      engine: data.engine as DatabaseEngine,
      connection: {
        host: data.host.trim(),
        port: Number(data.port),
        database: data.database.trim(),
        username: data.username.trim(),
        password: data.password,
        useSsl: data.useSsl,
      },
    })

    const conversationRecord = await createConversation({
      title: 'Conversacion inicial',
      database_id: databaseRecord.id,
    })

    onCreationSuccess(databaseRecord.id, conversationRecord.id)
    reset()
    onClose()
  }

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
              void handleSubmit(onSubmit)(event)
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Nombre para mostrar"
                placeholder="Almacen de analitica"
                error={errors.databaseName?.message}
                disabled={isPending}
                {...register('databaseName')}
              />

              <SelectField
                label="Motor"
                options={sqlEngineOptions}
                error={errors.engine?.message}
                disabled={isPending}
                {...register('engine')}
              />

              <div className="md:col-span-2">
                <InputField
                  label="Servidor (host)"
                  placeholder="db.company.internal"
                  error={errors.host?.message}
                  disabled={isPending}
                  {...register('host')}
                />
              </div>

              <InputField
                label="Puerto"
                inputMode="numeric"
                placeholder="5432"
                error={errors.port?.message}
                disabled={isPending}
                {...register('port')}
              />

              <InputField
                label="Nombre de la base de datos"
                placeholder="almacen_datos"
                error={errors.database?.message}
                disabled={isPending}
                {...register('database')}
              />

              <InputField
                label="Usuario"
                placeholder="usuario_lectura"
                error={errors.username?.message}
                disabled={isPending}
                {...register('username')}
              />

              <PasswordField
                label="Contrasena"
                placeholder="••••••••••••"
                error={errors.password?.message}
                disabled={isPending}
                {...register('password')}
              />
            </div>

            <ToggleField
              label="SSL habilitado"
              description="Usa una conexion cifrada para proteger el trafico entre la aplicacion y tu base de datos."
              disabled={isPending}
              {...register('useSsl')}
            />

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800/90 pt-5">
              <button
                type="submit"
                disabled={isPending || !isValid}
                className="cursor-pointer rounded-full border border-emerald-400/30 bg-emerald-400/12 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-emerald-200 uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <LoadingState
                    variant="inline"
                    label="Guardando..."
                    labelClassName="text-emerald-200"
                  />
                ) : (
                  'Agregar base de datos'
                )}
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
