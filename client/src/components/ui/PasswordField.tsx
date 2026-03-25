import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type JSX } from 'react'

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> {
  label: string
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
}

const defaultInputClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 pr-12 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)]'

const defaultLabelClassName =
  'text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase'

export const PasswordField = ({
  label,
  containerClassName = 'space-y-2',
  labelClassName = defaultLabelClassName,
  inputClassName = defaultInputClassName,
  ...inputProps
}: PasswordFieldProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className={containerClassName}>
      <span className={labelClassName}>{label}</span>

      <div className="relative">
        <input
          className={inputClassName}
          type={isVisible ? 'text' : 'password'}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 transition-colors duration-300 hover:text-emerald-300 focus-visible:text-emerald-300 focus-visible:outline-none"
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </label>
  )
}
