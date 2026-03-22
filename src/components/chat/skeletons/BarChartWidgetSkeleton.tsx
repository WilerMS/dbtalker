import type { JSX } from 'react'

const collapsedBars = ['h-24', 'h-36', 'h-30', 'h-20', 'h-40']

export const BarChartWidgetSkeleton = (): JSX.Element => {
  const bars = collapsedBars

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="h-3 w-44 animate-pulse rounded-full bg-zinc-800" />
      <div className="mt-4 flex h-[260px] items-end justify-between gap-4">
        {bars.map((height, index) => (
          <div
            key={`bar-skeleton-${index}`}
            className="flex h-full flex-1 flex-col justify-end"
          >
            <div
              className={[
                'w-full animate-pulse rounded-xl border border-emerald-400/25',
                'bg-linear-to-t from-emerald-950/90 via-emerald-700/45 to-emerald-400/50',
                height,
              ].join(' ')}
            />
            <div className="mx-auto mt-3 h-2 w-8 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
