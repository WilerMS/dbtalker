import type { JSX } from 'react'

import { ExpandableWidget } from '../ui/ExpandableWidget'
import type {
  BarData,
  CompleteMessage,
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
import { TextMessageSkeleton } from './skeletons/TextMessageSkeleton'
import { SchemaWidgetSkeleton } from './skeletons/SchemaWidgetSkeleton'
import { KpiWidgetSkeleton } from './skeletons/KpiWidgetSkeleton'
import { BarChartWidgetSkeleton } from './skeletons/BarChartWidgetSkeleton'
import { LineChartWidgetSkeleton } from './skeletons/LineChartWidgetSkeleton'
import { TableWidgetSkeleton } from './skeletons/TableWidgetSkeleton'

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
  // Render the appropriate skeleton while waiting for the real data
  if (message.status === 'pending') {
    switch (message.type) {
      case 'text':
        return <TextMessageSkeleton />
      case 'schema':
        return <SchemaWidgetSkeleton />
      case 'kpi':
        return <KpiWidgetSkeleton />
      case 'bar':
        return <BarChartWidgetSkeleton />
      case 'line':
        return <LineChartWidgetSkeleton />
      case 'table':
        return <TableWidgetSkeleton />
    }
  }

  const complete = message as CompleteMessage

  switch (complete.type) {
    case 'schema':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.schema}
        >
          {({ isExpanded }) => (
            <SchemaWidget
              data={complete.data as SchemaData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'kpi':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.kpi}
        >
          {({ isExpanded }) => (
            <KpiWidget
              data={complete.data as KpiData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'bar':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.bar}
        >
          {({ isExpanded }) => (
            <BarChartWidget
              data={complete.data as BarData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'line':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.line}
        >
          {({ isExpanded }) => (
            <LineChartWidget
              data={complete.data as LineData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'table':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={{
            width: 'min(96vw, 1320px)',
            height: `${(complete.data as TableData).rows.length * 45 + 50}px`,
          }}
        >
          {({ isExpanded }) => (
            <TableWidget
              data={complete.data as TableData}
              isExpanded={isExpanded}
            />
          )}
        </ExpandableWidget>
      )
    case 'text':
    default:
      return (
        <p className="text-sm leading-7 text-zinc-100">
          {(complete.data as TextData).text}
        </p>
      )
  }
}
