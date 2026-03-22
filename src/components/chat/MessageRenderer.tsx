import type { JSX } from 'react'

import { ExpandableWidget } from '../ui/ExpandableWidget'
import type {
  BarData,
  KpiData,
  Message,
  SchemaData,
  TableData,
  TextData,
  LineData,
} from '../../types/chat'
import { SchemaWidget } from './widgets/SchemaWidget'
import { KpiWidget } from './widgets/KpiWidget'
import { BarChartWidget } from './widgets/BarChartWidget'
import { LineChartWidget } from './widgets/LineChartWidget'
import { TableWidget } from './widgets/TableWidget'

interface MessageRendererProps {
  message: Message
}

const expandedWidgetSizes = {
  schema: {
    width: 'min(96vw, 1400px)',
    height: '82vh',
  },
  kpi: {
    width: 'min(90vw, 720px)',
  },
  bar: {
    width: 'min(95vw, 1180px)',
    height: '600px',
  },
  line: {
    width: 'min(95vw, 1180px)',
    height: '550px',
  },
  table: {
    width: 'min(96vw, 1320px)',
    height: '550px',
  },
} as const

export const MessageRenderer = ({
  message,
}: MessageRendererProps): JSX.Element => {
  switch (message.type) {
    case 'schema':
      return (
        <ExpandableWidget
          widgetId={message.id}
          expandedSize={expandedWidgetSizes.schema}
        >
          {({ isExpanded }) => (
            <SchemaWidget
              data={message.data as SchemaData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'kpi':
      return (
        <ExpandableWidget
          widgetId={message.id}
          expandedSize={expandedWidgetSizes.kpi}
        >
          {({ isExpanded }) => (
            <KpiWidget data={message.data as KpiData} isExpanded={isExpanded} />
          )}
        </ExpandableWidget>
      )
    case 'bar':
      return (
        <ExpandableWidget
          widgetId={message.id}
          expandedSize={expandedWidgetSizes.bar}
        >
          {({ isExpanded }) => (
            <BarChartWidget
              data={message.data as BarData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'line':
      return (
        <ExpandableWidget
          widgetId={message.id}
          expandedSize={expandedWidgetSizes.line}
        >
          {({ isExpanded }) => (
            <LineChartWidget
              data={message.data as LineData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'table':
      return (
        <ExpandableWidget
          widgetId={message.id}
          expandedSize={{
            width: 'min(96vw, 1320px)',
            height: `${(message.data as TableData).rows.length * 45 + 50}px`,
          }}
        >
          {({ isExpanded }) => (
            <TableWidget
              data={message.data as TableData}
              isExpanded={isExpanded}
            />
          )}
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
