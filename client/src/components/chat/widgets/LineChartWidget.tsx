import type { JSX } from 'react'

import type { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

import { buildBaseChartOptions } from './chartTheme'
import type { LineData } from '../../../types/chat'

interface LineChartWidgetProps {
  data: LineData
  isExpanded?: boolean
}

export const LineChartWidget = ({
  data,
  isExpanded = false,
}: LineChartWidgetProps): JSX.Element => {
  const chartHeight = isExpanded ? 460 : 280
  const categories = data.points.map((point) => point.x)
  const baseOptions = buildBaseChartOptions({
    categories,
    yAxisLabelFormatter: (value) => `${Math.round(value)}`,
  })

  const series = [
    {
      name: data.title ?? 'Serie',
      data: data.points.map((point) => point.y),
    },
  ]

  const options: ApexOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'area',
      parentHeightOffset: 0,
      dropShadow: {
        enabled: true,
        color: '#34d399',
        top: 10,
        left: 0,
        blur: 16,
        opacity: 0.18,
      },
    },
    colors: ['#34d399'],
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round',
    },
    markers: {
      size: 0,
      strokeColors: '#0f172a',
      strokeWidth: 0,
      hover: {
        size: 6,
        sizeOffset: 2,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.45,
        opacityFrom: 0.28,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      x: {
        show: true,
      },
      y: {
        formatter: (value: number) => `${value}`,
        title: {
          formatter: () => 'Valor',
        },
      },
    },
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/35 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="shrink-0 px-6 py-4">
        <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
          {data.title ?? 'Evolución temporal'}
        </p>
      </div>
      <div className="mt-4 w-full" style={{ height: chartHeight }}>
        <ReactApexChart
          type="area"
          options={options}
          series={series}
          height={chartHeight}
          width="100%"
        />
      </div>
    </div>
  )
}
