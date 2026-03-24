import type { JSX } from 'react'
import { Zap } from 'lucide-react'

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps): JSX.Element => {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 ${className}`}
    >
      <Zap className="size-8 text-emerald-400" strokeWidth={1.5} />
    </div>
  )
}
