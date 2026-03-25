import { useState, type JSX } from 'react'
import type { Element } from 'hast'
import ShikiHighlighter from 'react-shiki'
import type { CodeData } from '../../../types/chat'
import { dbtalkieTheme } from './codeTheme'
import { Play } from 'lucide-react'

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
  sendMessage: (text: string) => Promise<void>
  isLastMessage?: boolean
}

const expandedHeight = 'h-[72vh]'
const collapsedHeight = 'h-[26rem]'

export const CodeWidget = ({
  data,
  isExpanded = false,
  sendMessage,
  isLastMessage = false,
}: CodeWidgetProps): JSX.Element => {
  const [executed, setExecuted] = useState(false)
  const canRun = isLastMessage && !executed

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

      <div className="flex items-center justify-end border-t border-zinc-800 px-5 py-3">
        <button
          type="button"
          disabled={!canRun}
          onClick={async () => {
            if (!canRun) return
            setExecuted(true)
            await sendMessage('ejecuta este código')
          }}
          className={[
            'flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm! font-medium tracking-wide transition-all duration-300',
            canRun
              ? 'cursor-pointer border-emerald-400/50 bg-emerald-400/10 text-emerald-300 hover:border-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]'
              : 'cursor-not-allowed border-zinc-700 text-zinc-500 opacity-50',
          ].join(' ')}
        >
          <Play size={14} />
          {executed ? 'Ejecutado' : 'Ejecutar código'}
        </button>
      </div>
    </div>
  )
}
