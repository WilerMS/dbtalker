import type { JSX } from 'react'

interface LoadingStateProps {
  label?: string
  variant?: 'block' | 'inline'
  labelClassName?: string
}

export const LoadingState = ({
  label = 'Cargando...',
  variant = 'block',
  labelClassName,
}: LoadingStateProps): JSX.Element => {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-emerald-400/35 border-t-emerald-400" />
        <span className={`text-xs ${labelClassName ?? 'text-current'}`}>
          {label}
        </span>
      </span>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/35 border-t-emerald-400" />
        <span className={`text-xs ${labelClassName ?? 'text-zinc-400'}`}>
          {label}
        </span>
      </div>
    </div>
  )
}
