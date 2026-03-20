import type { JSX } from 'react'

import type { BarData } from '../../types/chat'

interface BarChartWidgetProps {
  data: BarData
}

export const BarChartWidget = ({ data }: BarChartWidgetProps): JSX.Element => {
  const maxValue = Math.max(...data.values, 1)

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
        {data.title}
      </p>
      <div className="mt-6 flex h-56 items-end gap-4">
        {data.values.map((value, index) => (
          <div
            key={`${data.labels[index]}-${value}`}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div
              style={{ height: `${(value / maxValue) * 100}%` }}
              className="w-full rounded-t-xl bg-gradient-to-t from-emerald-900 to-emerald-400"
            />
            <div className="text-center">
              <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
                {data.labels[index]}
              </p>
              <p className="mt-1 text-sm text-zinc-200">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
