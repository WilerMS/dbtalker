import type { JSX } from 'react'

import { BarChartWidget } from '../widgets/BarChartWidget'
import { KpiWidget } from '../widgets/KpiWidget'
import { LineChartWidget } from '../widgets/LineChartWidget'
import { SchemaWidget } from '../widgets/SchemaWidget'
import { TableWidget } from '../widgets/TableWidget'
import type {
  BarData,
  KpiData,
  Message,
  SchemaData,
  TableData,
  TextData,
  LineData,
} from '../../types/chat'

interface WidgetRendererProps {
  message: Message
}

export const WidgetRenderer = ({
  message,
}: WidgetRendererProps): JSX.Element => {
  switch (message.type) {
    case 'schema':
      return <SchemaWidget data={message.data as SchemaData} />
    case 'kpi':
      return <KpiWidget data={message.data as KpiData} />
    case 'bar':
      return <BarChartWidget data={message.data as BarData} />
    case 'line':
      return <LineChartWidget data={message.data as LineData} />
    case 'table':
      return <TableWidget data={message.data as TableData} />
    case 'text':
    default:
      return (
        <p className="text-sm leading-7 text-zinc-100">
          {(message.data as TextData).text}
        </p>
      )
  }
}
