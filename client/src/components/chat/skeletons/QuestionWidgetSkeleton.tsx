import type { JSX } from 'react'

export const QuestionWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="h-3 w-28 animate-pulse rounded-full bg-emerald-400/20" />
      <div className="mt-4 h-4 w-4/5 animate-pulse rounded-full bg-zinc-700/70" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-zinc-700/60" />

      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`question-skeleton-${index}`}
            className="h-14 animate-pulse rounded-xl border border-zinc-800 bg-zinc-800/60"
          />
        ))}
      </div>

      <div className="mt-5 h-3 w-3/5 animate-pulse rounded-full bg-zinc-700/50" />
    </div>
  )
}
