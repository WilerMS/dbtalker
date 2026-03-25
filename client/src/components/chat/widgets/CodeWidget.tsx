import type { JSX } from 'react'
import type { Element } from 'hast'
import ShikiHighlighter from 'react-shiki'
import type { CodeData } from '../../../types/chat'
import { dbtalkieTheme } from './codeTheme'

const transparentBgTransformer = {
  pre(node: Element) {
    if (typeof node.properties.style === 'string') {
      node.properties.style = node.properties.style.replace(
        /background(-color)?:[^;]+;?\s*/g,
        '',
      )
    }
  },
}

interface CodeWidgetProps {
  data: CodeData
  isExpanded?: boolean
}

const expandedHeight = 'h-[72vh]'
const collapsedHeight = 'h-[26rem]'

export const CodeWidget = ({
  data,
  isExpanded = false,
}: CodeWidgetProps): JSX.Element => {
  return (
    <div
      className={[
        'flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50',
        isExpanded ? expandedHeight : collapsedHeight,
      ].join(' ')}
    >
      <div className="border-b border-zinc-800 px-5 py-3">
        <p className="text-xs tracking-[0.28em] text-zinc-400 uppercase">
          {data.title}
        </p>
        {data.description ? (
          <p className="mt-2 text-xs leading-5 text-zinc-300/90">
            {data.description}
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
        <ShikiHighlighter
          addDefaultStyles={false}
          className="m-0! min-w-max border-0 bg-transparent text-[13px] leading-6"
          language={data.language}
          showLanguage
          theme={dbtalkieTheme}
          transformers={[transparentBgTransformer]}
        >
          {data.code}
        </ShikiHighlighter>
      </div>
    </div>
  )
}
