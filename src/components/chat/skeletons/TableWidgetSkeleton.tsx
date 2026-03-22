import type { JSX } from 'react'

const columnCount = 3
const rowCount = 5

export const TableWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {Array.from({ length: columnCount }).map((_, columnIndex) => (
              <th
                key={`table-head-${columnIndex}`}
                className="border-b border-zinc-800 px-4 py-3"
              >
                <div className="h-3 rounded-full bg-zinc-800" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr
              key={`table-row-${rowIndex}`}
              className="border-b border-zinc-800/50"
            >
              {Array.from({ length: columnCount }).map((__, columnIndex) => (
                <td
                  key={`table-cell-${rowIndex}-${columnIndex}`}
                  className="px-4 py-3"
                >
                  <div className="h-3 rounded-full bg-zinc-800/90" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
