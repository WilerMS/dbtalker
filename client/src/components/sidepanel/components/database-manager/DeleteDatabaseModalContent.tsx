import { X } from 'lucide-react'
import { useDeleteDatabase } from '../../../../hooks/useDatabases'
import type { DatabaseRecord } from '../../../../types/database'
import { LoadingState } from '../../../ui/LoadingState'

interface DeleteDatabaseModalContentProps {
  database: DatabaseRecord
  onClose: () => void
  onDeleteSuccess?: (databaseId: string) => void
}

export const DeleteDatabaseModalContent = ({
  database,
  onClose,
  onDeleteSuccess,
}: DeleteDatabaseModalContentProps) => {
  const { deleteDatabase, isPending } = useDeleteDatabase()

  const handleDeleteDatabase = async () => {
    const wasDeleted = await deleteDatabase(database.id)

    if (!wasDeleted) return

    onDeleteSuccess?.(database.id)
    onClose()
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/35 to-transparent" />

      <div className="border-b border-zinc-800/90 p-6 md:p-8 lg:border-r lg:border-b-0">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[0.02em] text-zinc-50">
              Eliminar base de datos
            </h2>
            <p className="max-w-2xl text-xs leading-6 text-zinc-400">
              Esta accion eliminara la base de datos
              <span className="px-1 text-zinc-200">{database.name}</span>
              del panel. Esta accion no se puede deshacer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950/70 p-2 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-emerald-400/40 hover:text-emerald-200 hover:shadow-[0_0_18px_rgba(52,211,153,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800/90 pt-5">
          <button
            type="button"
            onClick={() => {
              void handleDeleteDatabase()
            }}
            disabled={isPending}
            className="cursor-pointer rounded-full border border-rose-300/35 bg-rose-400/10 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-rose-200 uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <LoadingState
                variant="inline"
                label="Eliminando..."
                labelClassName="text-rose-200"
              />
            ) : (
              'Eliminar'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2.5 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </section>
  )
}
