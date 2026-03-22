import type { JSX } from 'react'

export const TextMessageSkeleton = (): JSX.Element => {
  return (
    <div className="max-w-2xl animate-pulse space-y-3 py-1">
      <div className="h-4 w-full rounded-full bg-zinc-800/90" />
      <div className="h-4 w-[92%] rounded-full bg-zinc-800/85" />
      <div className="h-4 w-[74%] rounded-full bg-zinc-800/80" />
    </div>
  )
}
