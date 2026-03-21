import type { JSX, ReactNode } from 'react'

interface SidePanelItemButtonProps {
  ariaLabel: string
  title: string
  children: ReactNode
  isActive?: boolean
  variant?: 'default' | 'danger'
  onClick?: () => void
}

const baseButtonClassName =
  'group flex size-11 cursor-pointer items-center justify-center rounded-full border bg-zinc-800/70 shadow-[inset_0_0_0_1px_rgba(24,24,27,0.75)] transition-all duration-300 ease-out'

const defaultButtonClassName =
  'border-emerald-500/55 text-emerald-200 hover:border-emerald-300/90 hover:bg-zinc-800/95 hover:text-emerald-100 hover:shadow-[0_0_18px_rgba(52,211,153,0.38),inset_0_0_0_1px_rgba(16,185,129,0.4)]'

const activeButtonClassName =
  'border-emerald-300/95 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.45),inset_0_0_0_1px_rgba(16,185,129,0.4)]'

const dangerButtonClassName =
  'border-rose-500/70 text-rose-300 hover:border-rose-400/95 hover:bg-zinc-800/95 hover:text-rose-200 hover:shadow-[0_0_18px_rgba(244,63,94,0.4),inset_0_0_0_1px_rgba(225,29,72,0.4)]'

export const SidePanelItemButton = ({
  ariaLabel,
  title,
  children,
  isActive = false,
  variant = 'default',
  onClick,
}: SidePanelItemButtonProps): JSX.Element => {
  const stateClassName =
    variant === 'danger'
      ? dangerButtonClassName
      : isActive
        ? activeButtonClassName
        : defaultButtonClassName

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title}
      aria-current={isActive}
      onClick={onClick}
      className={`${baseButtonClassName} ${stateClassName}`}
    >
      <span className="transition-transform duration-300 group-hover:scale-105">
        {children}
      </span>
    </button>
  )
}
