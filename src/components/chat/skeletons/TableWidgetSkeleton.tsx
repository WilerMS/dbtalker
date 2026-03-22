import type { JSX } from 'react'

export const TableWidgetSkeleton = (): JSX.Element => {
  const columnPlaceholders = ['w-24', 'w-20', 'w-28', 'w-16']
  const rowWidths = [
    ['w-20', 'w-16', 'w-24', 'w-14'],
    ['w-24', 'w-20', 'w-16', 'w-20'],
    ['w-16', 'w-24', 'w-20', 'w-16'],
    ['w-20', 'w-16', 'w-28', 'w-14'],
    ['w-16', 'w-20', 'w-16', 'w-24'],
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="h-12 shrink-0 px-6 py-4">
        <div className="h-3 w-44 animate-pulse rounded-full bg-zinc-800" />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            {columnPlaceholders.map((widthClass, columnIndex) => (
              <th
                key={`skeleton-head-${columnIndex}`}
                className="h-11.25 border-b border-zinc-800 px-6 py-0"
              >
                <div className="flex h-full items-center">
                  <span
                    className={`block h-2.5 animate-pulse rounded bg-zinc-700/80 ${widthClass}`}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rowWidths.map((row, rowIndex) => (
            <tr
              key={`skeleton-row-${rowIndex}`}
              className="border-b border-zinc-800/50"
            >
              {row.map((widthClass, columnIndex) => (
                <td
                  key={`skeleton-cell-${rowIndex}-${columnIndex}`}
                  className="h-11.25 px-6 py-0"
                >
                  <div className="flex h-full items-center">
                    <span
                      className={`block h-2.5 animate-pulse rounded bg-zinc-700/70 ${widthClass}`}
                    />
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
