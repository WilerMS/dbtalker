import ReactMarkdown from 'react-markdown'
import type { TextData } from '../../../types/chat'

interface TextWidgetProps {
  data: TextData
}

export const TextWidget = ({ data }: TextWidgetProps) => {
  return (
    <div className="prose prose-invert max-w-none text-base leading-7 text-zinc-100">
      <ReactMarkdown>{data.text}</ReactMarkdown>
    </div>
  )
}
