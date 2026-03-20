import type { JSX } from 'react'

import { ExpandableWidget } from '../ui/ExpandableWidget'
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

interface MessageRendererProps {
  message: Message
}

export const MessageRenderer = ({
  message,
}: MessageRendererProps): JSX.Element => {
  switch (message.type) {
    case 'schema':
      return (
        <ExpandableWidget widgetId={message.id}>
          <SchemaWidget data={message.data as SchemaData} />
        </ExpandableWidget>
      )
    case 'kpi':
      return (
        <ExpandableWidget widgetId={message.id}>
          <KpiWidget data={message.data as KpiData} />
        </ExpandableWidget>
      )
    case 'bar':
      return (
        <ExpandableWidget widgetId={message.id}>
          <BarChartWidget data={message.data as BarData} />
        </ExpandableWidget>
      )
    case 'line':
      return (
        <ExpandableWidget widgetId={message.id}>
          <LineChartWidget data={message.data as LineData} />
        </ExpandableWidget>
      )
    case 'table':
      return (
        <ExpandableWidget widgetId={message.id}>
          <TableWidget data={message.data as TableData} />
        </ExpandableWidget>
      )
    case 'text':
    default:
      return (
        <p className="text-sm leading-7 text-zinc-100">
          {(message.data as TextData).text}
        </p>
      )
  }
}
