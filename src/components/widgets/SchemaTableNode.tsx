import { KeyRound } from 'lucide-react'
import type { JSX } from 'react'
import type { NodeProps } from 'reactflow'

import type { SchemaNodeData } from '../../types/chat'

export const SchemaTableNode = ({
  data,
}: NodeProps<SchemaNodeData>): JSX.Element => {
  return (
    <div className="min-w-52 rounded-xl border border-zinc-700 bg-zinc-900/80 p-4">
      <p className="text-xs tracking-[0.28em] text-emerald-400 uppercase">
        table
      </p>
      <h3 className="mt-2 text-sm font-semibold tracking-[0.25em] text-zinc-100 uppercase">
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
            <span className="tracking-[0.2em] text-zinc-500 uppercase">
              {column.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
