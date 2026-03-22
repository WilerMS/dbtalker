import type { JSX } from 'react'

interface TableWidgetSkeletonProps {
  isExpanded?: boolean
}

const rowCountByMode = {
  collapsed: 5,
  expanded: 10,
} as const

export const TableWidgetSkeleton = ({
  isExpanded = false,
}: TableWidgetSkeletonProps): JSX.Element => {
  const rowCount = isExpanded
    ? rowCountByMode.expanded
    : rowCountByMode.collapsed

  return (
    <div
      className={`animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 ${isExpanded ? 'max-h-[72vh] overflow-auto' : 'overflow-hidden'}`}
    >
      <div className="grid grid-cols-4 gap-3 border-b border-zinc-800 px-4 py-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`table-head-${index}`}
            className="h-3 rounded-full bg-zinc-800"
          />
        ))}
      </div>

      <div className="divide-y divide-zinc-800/50">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={`table-row-${rowIndex}`}
            className="grid grid-cols-4 gap-3 px-4 py-3"
          >
            {Array.from({ length: 4 }).map((__, columnIndex) => (
              <div
                key={`table-cell-${rowIndex}-${columnIndex}`}
                className="h-3 rounded-full bg-zinc-800/90"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
