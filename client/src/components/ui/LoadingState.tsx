import type { JSX } from 'react'

interface LoadingStateProps {
  label?: string
}

export const LoadingState = ({
  label = 'Cargando...',
}: LoadingStateProps): JSX.Element => {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/35 border-t-emerald-400" />
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
    </div>
  )
}
