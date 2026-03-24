import type { JSX } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

interface SidePanelDatabaseActionsProps {
  onEdit: () => void
  onDelete: () => void
  compact?: boolean
}

const actionButtonClassName =
  'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-300 transition-all duration-300 ease-out hover:scale-105 hover:border-emerald-300/65 hover:text-emerald-200'

export const SidePanelDatabaseActions = ({
  onEdit,
  onDelete,
  compact = false,
}: SidePanelDatabaseActionsProps): JSX.Element => {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 self-center">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar base de datos"
          className="cursor-pointer rounded-lg p-1 text-zinc-300 transition-all duration-300 ease-out hover:scale-110 hover:text-emerald-200"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar base de datos"
          className="cursor-pointer rounded-lg p-1 text-rose-300 transition-all duration-300 ease-out hover:scale-110 hover:text-rose-200"
        >
          <Trash2 size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full gap-2">
      <button type="button" onClick={onEdit} className={actionButtonClassName}>
        <Pencil size={14} />
        Editar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/40 px-3 py-2 text-xs text-rose-300 transition-all duration-300 ease-out hover:scale-105 hover:border-rose-300/65 hover:text-rose-200"
      >
        <Trash2 size={14} />
        Eliminar
      </button>
    </div>
  )
}
