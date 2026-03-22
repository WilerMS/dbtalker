import type { JSX } from 'react'

export const KpiWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="flex h-39.5 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/35 border-t-emerald-400" />
        <p className="text-sm font-medium tracking-wide text-zinc-300">
          Generando widget
        </p>
      </div>
    </div>
  )
}
