import type { InputHTMLAttributes, JSX } from 'react'

interface ToggleFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> {
  label: string
  description?: string
  containerClassName?: string
  labelClassName?: string
  descriptionClassName?: string
}

const defaultContainerClassName =
  'cursor-pointer flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-3'

const defaultLabelClassName = 'text-sm font-medium text-zinc-100'

const defaultDescriptionClassName = 'mt-1 text-xs leading-5 text-zinc-500'

export const ToggleField = ({
  label,
  description,
  containerClassName = defaultContainerClassName,
  labelClassName = defaultLabelClassName,
  descriptionClassName = defaultDescriptionClassName,
  ...inputProps
}: ToggleFieldProps): JSX.Element => {
  return (
    <label className={containerClassName}>
      <div>
        <p className={labelClassName}>{label}</p>
        {description ? (
          <p className={descriptionClassName}>{description}</p>
        ) : null}
      </div>

      <span className="relative inline-flex items-center">
        <input type="checkbox" className="peer sr-only" {...inputProps} />
        <span className="h-6 w-11 rounded-full border border-zinc-700 bg-zinc-900 transition-colors duration-300 peer-checked:border-emerald-400/50 peer-checked:bg-emerald-400/20" />
        <span className="pointer-events-none absolute left-1 size-4 rounded-full bg-zinc-300 transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-emerald-300" />
      </span>
    </label>
  )
}
