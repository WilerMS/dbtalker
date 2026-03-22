import type { JSX } from 'react'

export const KpiWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6">
      <div className="h-12 w-44 rounded-lg bg-zinc-800/90" />
      <div className="mt-4 h-3 w-44 rounded-full bg-zinc-800" />
      <div className="mt-5 h-3 w-20 rounded-full bg-zinc-800/80" />
    </div>
  )
}
