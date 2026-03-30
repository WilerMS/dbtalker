import type { JSX } from 'react'
import type { TableData } from '../../../types/chat'

interface TableWidgetProps {
  data: TableData
  isExpanded?: boolean
}

const expandedHeight = 'h-[72vh]'
const collapsedHeight = 'h-[26rem]'

export const TableWidget = ({
  data,
  isExpanded = false,
}: TableWidgetProps): JSX.Element => {
  return (
    <div
      data-component="TableWidget"
      className={`h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 ${isExpanded ? expandedHeight : collapsedHeight}`}
    >
      <div className="h-12 shrink-0 px-6 py-4">
        <div className="flex h-full items-center">
          <p className="text-xs leading-3 tracking-[0.3em] text-zinc-400 uppercase">
            {data.title}
          </p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th
                key={column}
                className="h-11.25 border-b border-zinc-800 px-6 py-0 text-left"
              >
                <div className="flex h-full items-center">
                  <span className="block text-xs tracking-widest text-zinc-400 uppercase">
                    {column}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="border-b border-zinc-800/50 text-zinc-200 transition-colors hover:bg-emerald-900/20"
            >
              {row.map((column) => (
                <td key={`${rowIndex}-${column}`} className="h-11.25 px-6 py-0">
                  <div className="flex h-full items-center">
                    <span className="block">{column}</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
