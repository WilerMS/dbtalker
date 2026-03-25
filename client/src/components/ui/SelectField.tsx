import type { JSX, SelectHTMLAttributes } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'className' | 'children'
> {
  label: string
  options: readonly SelectOption[]
  error?: string
}

const baseSelectClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)]'

const errorSelectClassName =
  'w-full rounded-2xl border border-red-500/60 bg-zinc-950/75 px-4 py-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-red-500/80 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(239,68,68,0.2),0_0_18px_rgba(239,68,68,0.12)]'

export const SelectField = ({
  label,
  options,
  error,
  ...selectProps
}: SelectFieldProps): JSX.Element => {
  return (
    <label className="flex h-22 flex-col gap-2">
      <span className="ml-1 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
        {label}
      </span>
      <select
        className={error ? errorSelectClassName : baseSelectClassName}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="-mt-0.5 ml-0.5 px-1 text-xs text-red-400">{error}</p>
      )}
    </label>
  )
}
