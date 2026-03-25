import type { InputHTMLAttributes, JSX } from 'react'

interface ToggleFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> {
  label: string
  description?: string
  error?: string
}

const baseContainerClassName =
  'cursor-pointer flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-3'

const errorContainerClassName =
  'cursor-pointer flex items-center justify-between gap-4 rounded-2xl border border-red-500/60 bg-zinc-950/55 px-4 py-3'

export const ToggleField = ({
  label,
  description,
  error,
  ...inputProps
}: ToggleFieldProps): JSX.Element => {
  const containerClassName = error
    ? errorContainerClassName
    : baseContainerClassName

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={`${containerClassName} ${inputProps.disabled ? 'cursor-not-allowed opacity-55' : ''}`}
      >
        <div>
          <p className="text-sm font-medium text-zinc-100">{label}</p>
          {description && (
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <span className="relative inline-flex items-center">
          <input type="checkbox" className="peer sr-only" {...inputProps} />
          <span className="h-6 w-11 rounded-full border border-zinc-700 bg-zinc-900 transition-colors duration-300 peer-checked:border-emerald-400/50 peer-checked:bg-emerald-400/20 peer-disabled:opacity-55" />
          <span className="pointer-events-none absolute left-1 size-4 rounded-full bg-zinc-300 transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-emerald-300 peer-disabled:opacity-55" />
        </span>
      </label>

      {error && <p className="px-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
