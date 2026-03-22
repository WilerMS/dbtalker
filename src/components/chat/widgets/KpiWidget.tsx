import type { JSX } from 'react'
import type { KpiData } from '../../../types/chat'

interface KpiWidgetProps {
  data: KpiData
  isExpanded?: boolean
}

export const KpiWidget = ({
  data,
  isExpanded = false,
}: KpiWidgetProps): JSX.Element => {
  const deltaTone = data.delta?.startsWith('-')
    ? 'text-red-400'
    : 'text-emerald-400'

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/35 ${isExpanded ? 'p-8' : 'p-6'}`}
    >
      <p
        className={`${isExpanded ? 'text-6xl' : 'text-5xl'} font-bold text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.6)]`}
      >
        {data.value}
      </p>
      <p className="mt-2 text-sm tracking-widest text-zinc-400 uppercase">
        {data.label}
      </p>
      {data.delta ? (
        <p className={['mt-4 text-xs', deltaTone].join(' ')}>{data.delta}</p>
      ) : null}
    </div>
  )
}
