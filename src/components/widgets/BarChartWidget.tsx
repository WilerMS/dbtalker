import type { JSX } from 'react'

import type { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

import type { BarData } from '../../types/chat'
import { buildBaseChartOptions } from './chartTheme'

interface BarChartWidgetProps {
  data: BarData
}

export const BarChartWidget = ({ data }: BarChartWidgetProps): JSX.Element => {
  const baseOptions = buildBaseChartOptions({
    categories: data.labels,
    yAxisLabelFormatter: (value) => `${Math.round(value)}`,
  })

  const series = [
    {
      name: data.title ?? 'Serie',
      data: data.values,
    },
  ]

  const options: ApexOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
      parentHeightOffset: 0,
      dropShadow: {
        enabled: true,
        color: '#34d399',
        top: 6,
        left: 0,
        blur: 14,
        opacity: 0.2,
      },
    },
    colors: ['#34d399'],
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: 'end',
        columnWidth: '48%',
        distributed: false,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.65,
        opacityFrom: 0.95,
        opacityTo: 0.3,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              color: '#6ee7b7',
              opacity: 0.95,
            },
            {
              offset: 100,
              color: '#064e3b',
              opacity: 0.92,
            },
          ],
        ],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['rgba(167, 243, 208, 0.35)'],
    },
    tooltip: {
      ...baseOptions.tooltip,
      y: {
        formatter: (value: number) => `${value}`,
        title: {
          formatter: () => 'Valor',
        },
      },
    },
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
        {data.title}
      </p>
      <div className="mt-4">
        <ReactApexChart
          type="bar"
          options={options}
          series={series}
          height={260}
        />
      </div>
    </div>
  )
}
