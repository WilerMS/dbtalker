import type { JSX } from 'react'

const fakeLines = [
  'w-[92%]',
  'w-[74%]',
  'w-[86%]',
  'w-[58%]',
  'w-[68%]',
  'w-[79%]',
  'w-[92%]',
  'w-[74%]',
  'w-[86%]',
  'w-[58%]',
  'w-[68%]',
  'w-[79%]',
  'w-[79%]',
  'w-[92%]',
  'w-[74%]',
  'w-[86%]',
]

export const CodeWidgetSkeleton = (): JSX.Element => {
  return (
    <div className="h-104 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-3">
        <div className="h-3 w-48 animate-pulse rounded-full bg-zinc-800" />
        <div className="mt-2 h-2.5 w-80 animate-pulse rounded-full bg-zinc-800/80" />
      </div>

      <div className="rounded-xl p-5">
        {fakeLines.map((widthClass, index) => (
          <div
            key={`code-skeleton-line-${index}`}
            className="mb-2.5 h-2.5 last:mb-0"
          >
            <div
              className={`h-full animate-pulse rounded bg-zinc-700/70 ${widthClass}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
