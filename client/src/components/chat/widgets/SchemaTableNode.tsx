import { KeyRound } from 'lucide-react'
import type { JSX } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { SchemaNodeData } from '../../../types/chat'

export const SchemaTableNode = ({
  data,
}: NodeProps<SchemaNodeData>): JSX.Element => {
  return (
    <div className="group relative min-w-56 rounded-xl border border-zinc-700/70 bg-gradient-to-br from-zinc-900/95 via-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/70 hover:shadow-[0_0_28px_rgba(52,211,153,0.33)]">
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-400/0 to-emerald-500/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border !border-zinc-900 !bg-emerald-400 !shadow-[0_0_12px_rgba(52,211,153,0.8)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border !border-zinc-900 !bg-emerald-400 !shadow-[0_0_12px_rgba(52,211,153,0.8)]"
      />
      <p className="text-xs tracking-[0.28em] text-emerald-400 uppercase">
        table
      </p>
      <h3 className="mt-2 text-sm font-semibold tracking-[0.14em] text-zinc-100 uppercase">
        {data.label}
      </h3>
      <ul className="mt-4 space-y-2">
        {data.columns.map((column) => (
          <li
            key={column.name}
            className="flex items-center justify-between gap-3 text-xs text-zinc-300"
          >
            <span className="flex items-center gap-2">
              {column.isPrimaryKey ? (
                <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
              ) : null}
              {column.name}
            </span>
            <span className="tracking-[0.08em] text-zinc-500 uppercase">
              {column.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
