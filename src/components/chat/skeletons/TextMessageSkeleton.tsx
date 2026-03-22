import type { JSX } from 'react'

export const TextMessageSkeleton = (): JSX.Element => {
  return (
    <div className="max-w-2xl animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="h-3 w-28 rounded-full bg-zinc-800" />
      <div className="mt-4 space-y-2">
        <div className="h-3 rounded-full bg-zinc-800" />
        <div className="h-3 w-5/6 rounded-full bg-zinc-800" />
        <div className="h-3 w-2/3 rounded-full bg-zinc-800" />
      </div>
    </div>
  )
}
