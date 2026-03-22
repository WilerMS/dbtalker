import type { JSX } from 'react'

interface BarChartWidgetSkeletonProps {
  isExpanded?: boolean
}

const collapsedBars = ['h-24', 'h-36', 'h-30', 'h-20', 'h-40']
const expandedBars = ['h-36', 'h-56', 'h-44', 'h-32', 'h-60']

export const BarChartWidgetSkeleton = ({
  isExpanded = false,
}: BarChartWidgetSkeletonProps): JSX.Element => {
  const chartHeight = isExpanded ? 'h-[440px]' : 'h-[260px]'
  const bars = isExpanded ? expandedBars : collapsedBars

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="h-3 w-44 animate-pulse rounded-full bg-zinc-800" />
      <div
        className={`mt-6 flex items-end justify-between gap-4 ${chartHeight}`}
      >
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
