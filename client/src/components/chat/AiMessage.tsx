import { ExpandableWidget } from '../ui/ExpandableWidget'
import type {
  BarData,
  CodeData,
  CompleteMessage,
  KpiData,
  LineData,
  Message,
  QuestionData,
  SchemaData,
  TableData,
  TextData,
} from '../../types/chat'
import { SchemaWidget } from './widgets/SchemaWidget'
import { KpiWidget } from './widgets/KpiWidget'
import { BarChartWidget } from './widgets/BarChartWidget'
import { LineChartWidget } from './widgets/LineChartWidget'
import { TableWidget } from './widgets/TableWidget'
import { CodeWidget } from './widgets/CodeWidget'
import { QuestionWidget } from './widgets/QuestionWidget'
import { TextMessageSkeleton } from './skeletons/TextMessageSkeleton'
import { SchemaWidgetSkeleton } from './skeletons/SchemaWidgetSkeleton'
import { KpiWidgetSkeleton } from './skeletons/KpiWidgetSkeleton'
import { BarChartWidgetSkeleton } from './skeletons/BarChartWidgetSkeleton'
import { LineChartWidgetSkeleton } from './skeletons/LineChartWidgetSkeleton'
import { TableWidgetSkeleton } from './skeletons/TableWidgetSkeleton'
import { CodeWidgetSkeleton } from './skeletons/CodeWidgetSkeleton'
import { QuestionWidgetSkeleton } from './skeletons/QuestionWidgetSkeleton'
import { TextWidget } from './widgets/TextWidget'

interface AiMessageProps {
  message: Message
  isLastMessage?: boolean
  sendMessage: (text: string) => Promise<void>
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
  code: {
    width: 'min(96vw, 1320px)',
    height: '720px',
  },
  question: {
    width: 'min(95vw, 900px)',
  },
} as const

export const AiMessage = ({
  message,
  isLastMessage,
  sendMessage,
}: AiMessageProps) => {
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
      case 'code':
        return <CodeWidgetSkeleton />
      case 'question':
        return <QuestionWidgetSkeleton />
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
    case 'code':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.code}
        >
          {({ isExpanded }) => (
            <CodeWidget
              data={complete.data as CodeData}
              isExpanded={isExpanded}
              sendMessage={sendMessage}
              isLastMessage={isLastMessage}
            />
          )}
        </ExpandableWidget>
      )
    case 'question':
      return (
        <ExpandableWidget
          widgetId={complete.id}
          expandedSize={expandedWidgetSizes.question}
        >
          {({ isExpanded }) => (
            <QuestionWidget
              data={complete.data as QuestionData}
              isExpanded={isExpanded}
              sendMessage={sendMessage}
              isLastMessage={isLastMessage}
            />
          )}
        </ExpandableWidget>
      )
    case 'text':
    default:
      return <TextWidget data={complete.data as TextData} />
  }
}
