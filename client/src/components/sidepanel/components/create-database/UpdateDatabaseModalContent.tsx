import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useUpdateDatabase } from '../../../../hooks/useDatabases'
import type { DatabaseEngine, DatabaseRecord } from '../../../../types/database'
import { InputField } from '../../../ui/InputField'
import { LoadingState } from '../../../ui/LoadingState'
import { SelectField } from '../../../ui/SelectField'
import {
  databaseFormSchema,
  getUpdateDatabaseDefaultValues,
  sqlEngineOptions,
  type UpdateDatabaseFormState,
} from './databaseFormSchema'

interface UpdateDatabaseModalContentProps {
  database: DatabaseRecord
  onClose: () => void
  onUpdateSuccess?: (databaseId: string) => void
}

export const UpdateDatabaseModalContent = ({
  database,
  onClose,
  onUpdateSuccess,
}: UpdateDatabaseModalContentProps) => {
  const { updateDatabase, isPending } = useUpdateDatabase()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateDatabaseFormState>({
    resolver: zodResolver(databaseFormSchema),
    mode: 'onTouched',
    defaultValues: getUpdateDatabaseDefaultValues(database),
  })

  const onSubmit = async (data: UpdateDatabaseFormState) => {
    const updatedDatabase = await updateDatabase({
      id: database.id,
      input: {
        name: data.databaseName.trim(),
        engine: data.engine as DatabaseEngine,
      },
    })

    if (!updatedDatabase) {
      return
    }

    onUpdateSuccess?.(updatedDatabase.id)
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
                  Editar conexion de base de datos
                </h2>
                <p className="max-w-2xl text-xs leading-6 text-zinc-400">
                  Actualiza la configuracion basica de esta base de datos para
                  mantener la informacion de DBTalkie al dia.
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
            </div>

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
                  'Guardar cambios'
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
