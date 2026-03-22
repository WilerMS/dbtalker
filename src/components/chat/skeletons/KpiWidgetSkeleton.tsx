import type { JSX } from 'react'

interface KpiWidgetSkeletonProps {
  isExpanded?: boolean
}

export const KpiWidgetSkeleton = ({
  isExpanded = false,
}: KpiWidgetSkeletonProps): JSX.Element => {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/35 ${isExpanded ? 'p-8' : 'p-6'}`}
    >
      <div
        className={`rounded-lg bg-zinc-800/90 ${isExpanded ? 'h-14 w-56' : 'h-12 w-44'}`}
      />
      <div className="mt-4 h-3 w-44 rounded-full bg-zinc-800" />
      <div className="mt-5 h-3 w-20 rounded-full bg-zinc-800/80" />
    </div>
  )
}
