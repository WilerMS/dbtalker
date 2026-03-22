import type { JSX } from 'react'

interface SpeakerAvatarProps {
  role: 'user' | 'bot'
  timestamp: Date
  orientation: 'left' | 'right'
}

export const SpeakerAvatar = ({
  role,
  timestamp,
  orientation,
}: SpeakerAvatarProps): JSX.Element => {
  const label = role === 'user' ? 'User' : 'Assistant'
  const initials = role === 'user' ? 'U' : 'AI'
  const timeString = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const circle =
    role === 'bot' ? (
      <span
        aria-label="Assistant"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-zinc-900/80 text-sm font-semibold text-emerald-300"
      >
        {initials}
      </span>
    ) : (
      <span
        aria-label="User"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-semibold text-zinc-200"
      >
        {initials}
      </span>
    )

  const meta = (
    <div
      className={[
        'flex flex-col justify-center gap-0.5',
        orientation === 'right' ? 'items-end' : 'items-start',
      ].join(' ')}
    >
      <span className="text-xs tracking-[0.2em] text-zinc-400 capitalize">
        {label}
      </span>
      <span className="text-xs text-zinc-600">{timeString}</span>
    </div>
  )

  return (
    <div
      className={[
        'flex items-center gap-2',
        orientation === 'right' ? 'flex-row-reverse' : 'flex-row',
      ].join(' ')}
    >
      {circle}
      {meta}
    </div>
  )
}
