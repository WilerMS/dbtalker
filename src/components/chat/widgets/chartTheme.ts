import type { ApexOptions } from 'apexcharts'

import './chartTheme.css'

const chartFontFamily = 'Space Grotesk, Segoe UI, sans-serif'

interface BuildBaseChartOptionsArgs {
  categories: string[]
  yAxisLabelFormatter?: (value: number) => string
}

export const buildBaseChartOptions = ({
  categories,
  yAxisLabelFormatter,
}: BuildBaseChartOptionsArgs): ApexOptions => {
  return {
    chart: {
      background: 'transparent',
      fontFamily: chartFontFamily,
      foreColor: '#a1a1aa',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 420,
        animateGradually: {
          enabled: true,
          delay: 70,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 320,
        },
      },
    },
    grid: {
      borderColor: 'rgba(63, 63, 70, 0.38)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken',
        },
      },
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          color: 'rgba(52, 211, 153, 0.28)',
          dashArray: 4,
        },
      },
      labels: {
        style: {
          colors: categories.map(() => '#71717a'),
          fontFamily: chartFontFamily,
          fontSize: '10px',
          fontWeight: 600,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: yAxisLabelFormatter,
        style: {
          colors: ['#71717a'],
          fontFamily: chartFontFamily,
          fontSize: '10px',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      style: {
        fontFamily: chartFontFamily,
        fontSize: '12px',
      },
      marker: {
        show: false,
      },
    },
    noData: {
      text: 'Sin datos',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#a1a1aa',
        fontFamily: chartFontFamily,
      },
    },
  }
}
