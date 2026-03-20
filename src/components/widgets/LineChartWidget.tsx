import type { JSX } from 'react'

import type { LineData } from '../../types/chat'

interface LineChartWidgetProps {
  data: LineData
}

const width = 560
const height = 220
const padding = 24

export const LineChartWidget = ({
  data,
}: LineChartWidgetProps): JSX.Element => {
  const maxValue = Math.max(...data.points.map((point) => point.y), 1)
  const minValue = Math.min(...data.points.map((point) => point.y), 0)
  const range = Math.max(maxValue - minValue, 1)

  const coordinates = data.points.map((point, index) => {
    const xPosition =
      padding +
      (index * (width - padding * 2)) / Math.max(data.points.length - 1, 1)
    const yPosition =
      height - padding - ((point.y - minValue) / range) * (height - padding * 2)

    return { label: point.x, value: point.y, xPosition, yPosition }
  })

  const linePath = coordinates
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.xPosition} ${point.yPosition}`,
    )
    .join(' ')

  const areaPath = `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
        {data.title}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-6 w-full overflow-visible"
      >
        <defs>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {coordinates.map((point) => (
          <line
            key={`grid-${point.label}`}
            x1={point.xPosition}
            y1={padding}
            x2={point.xPosition}
            y2={height - padding}
            stroke="rgba(63,63,70,0.45)"
            strokeDasharray="3 9"
          />
        ))}

        <path d={areaPath} fill="rgba(52,211,153,0.05)" />
        <path
          d={linePath}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          filter="url(#lineGlow)"
        />

        {coordinates.map((point) => (
          <g key={`${point.label}-${point.value}`}>
            <circle
              cx={point.xPosition}
              cy={point.yPosition}
              r="4"
              fill="#34d399"
            />
            <text
              x={point.xPosition}
              y={height - 4}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px] tracking-[0.2em] uppercase"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 flex justify-between gap-2 text-xs tracking-[0.2em] text-zinc-500 uppercase">
        {data.points.map((point) => (
          <span key={`${point.x}-${point.y}`}>{point.x}</span>
        ))}
      </div>
    </div>
  )
}
