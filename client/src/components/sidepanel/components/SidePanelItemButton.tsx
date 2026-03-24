import type { JSX, ReactNode } from 'react'

interface SidePanelItemButtonProps {
  title?: string
  children: ReactNode
  isActive?: boolean
  variant?: 'default' | 'danger'
  onClick?: () => void
}

const baseButtonClassName =
  'group relative isolate flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-zinc-800/90 bg-zinc-900/35 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(24,24,27,0.75)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/70'

const defaultButtonClassName =
  'text-zinc-300 hover:border-emerald-400/45 hover:bg-zinc-900/50 hover:text-emerald-100 hover:shadow-[0_0_16px_rgba(52,211,153,0.24),inset_0_0_0_1px_rgba(16,185,129,0.25)]'

const activeButtonClassName =
  'border-emerald-400/75 bg-zinc-900/55 text-emerald-100 ring-1 ring-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.34),inset_0_0_0_1px_rgba(16,185,129,0.38)]'

const dangerButtonClassName =
  'border-zinc-800/90 text-rose-300 hover:border-rose-400/55 hover:bg-zinc-900/50 hover:text-rose-200 hover:shadow-[0_0_16px_rgba(244,63,94,0.3),inset_0_0_0_1px_rgba(225,29,72,0.22)]'

export const SidePanelItemButton = ({
  title,
  children,
  isActive = false,
  variant = 'default',
  onClick,
}: SidePanelItemButtonProps): JSX.Element => {
  const accentHighlightClassName =
    variant === 'danger' ? 'to-rose-300/12' : 'to-emerald-300/10'

  const movingShineClassName =
    variant === 'danger'
      ? 'from-transparent via-rose-200/35 to-transparent'
      : 'from-transparent via-emerald-200/35 to-transparent'

  const movingShineOpacityClassName = isActive
    ? 'opacity-100'
    : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'

  const stateClassName =
    variant === 'danger'
      ? dangerButtonClassName
      : isActive
        ? activeButtonClassName
        : defaultButtonClassName

  return (
    <button
      type="button"
      title={title}
      aria-current={isActive}
      onClick={onClick}
      className={`shrink-0 ${baseButtonClassName} ${stateClassName}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-white/10 via-transparent ${accentHighlightClassName}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-[45%] animate-spin rounded-full bg-conic ${movingShineClassName} ${movingShineOpacityClassName} blur-sm transition-opacity duration-300 [animation-duration:4.5s]`}
      />
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 group-[aria-current=true]:scale-105">
        {children}
      </span>
    </button>
  )
}
