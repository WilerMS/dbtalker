import type { JSX } from 'react'

export const LineChartWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="h-3 w-44 animate-pulse rounded-full bg-zinc-800" />
      <div className="relative mt-4 h-70 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/55">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.14),transparent_42%)]" />
        <svg viewBox="0 0 800 360" className="absolute inset-0 h-full w-full">
          <path
            d="M20 290 C120 260, 180 250, 260 220 C340 190, 430 210, 500 170 C580 130, 670 150, 780 90"
            stroke="rgba(52,211,153,0.72)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <path
            d="M20 290 C120 260, 180 250, 260 220 C340 190, 430 210, 500 170 C580 130, 670 150, 780 90 L780 360 L20 360 Z"
            fill="url(#line-skeleton-fill)"
          />
          <defs>
            <linearGradient id="line-skeleton-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(52,211,153,0.22)" />
              <stop offset="100%" stopColor="rgba(5,46,22,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
