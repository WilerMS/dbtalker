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
  containerClassName?: string
  labelClassName?: string
  selectClassName?: string
}

const defaultSelectClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)]'

const defaultLabelClassName =
  'text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase'

export const SelectField = ({
  label,
  options,
  containerClassName = 'space-y-2',
  labelClassName = defaultLabelClassName,
  selectClassName = defaultSelectClassName,
  ...selectProps
}: SelectFieldProps): JSX.Element => {
  return (
    <label className={containerClassName}>
      <span className={labelClassName}>{label}</span>
      <select className={selectClassName} {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
