import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type JSX } from 'react'

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> {
  label: string
  error?: string
}

const baseInputClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 pr-12 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color,opacity] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)] disabled:cursor-not-allowed disabled:opacity-55'

const errorInputClassName =
  'w-full rounded-2xl border border-red-500/60 bg-zinc-950/75 px-4 py-3 pr-12 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color,opacity] duration-300 placeholder:text-zinc-500 focus:border-red-500/80 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(239,68,68,0.2),0_0_18px_rgba(239,68,68,0.12)] disabled:cursor-not-allowed disabled:opacity-55'

export const PasswordField = ({
  label,
  error,
  ...inputProps
}: PasswordFieldProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className="flex h-21 flex-col gap-2">
      <span className="ml-1 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
        {label}
      </span>

      <div className="relative">
        <input
          className={error ? errorInputClassName : baseInputClassName}
          type={isVisible ? 'text' : 'password'}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={inputProps.disabled}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 transition-colors duration-300 hover:text-emerald-300 focus-visible:text-emerald-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="-mt-0.5 ml-0.5 px-1 text-xs text-red-400">{error}</p>
      )}
    </label>
  )
}
