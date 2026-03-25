import { useMemo, useState, type JSX } from 'react'
import type { QuestionData } from '../../../types/chat'

interface QuestionWidgetProps {
  data: QuestionData
  isExpanded?: boolean
  isLastMessage?: boolean
  sendMessage: (text: string) => Promise<void>
}

export const QuestionWidget = ({
  data,
  isExpanded = false,
  isLastMessage = false,
  sendMessage,
}: QuestionWidgetProps): JSX.Element => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>()
  const normalizedOptions = useMemo(
    () => data.options.slice(0, 3),
    [data.options],
  )
  const isLocked = selectedOptionId !== undefined || !isLastMessage

  console.log({ isLastMessage, isLocked })

  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6',
        'before:pointer-events-none before:absolute before:-top-24 before:-right-20 before:h-48 before:w-48 before:rounded-full before:bg-emerald-400/10 before:blur-2xl',
        'after:pointer-events-none after:absolute after:-bottom-20 after:-left-16 after:h-44 after:w-44 after:rounded-full after:bg-cyan-400/10 after:blur-2xl',
        isExpanded ? 'space-y-6' : 'space-y-5',
      ].join(' ')}
    >
      <div className="relative z-10">
        <p className="text-xs tracking-[0.28em] text-emerald-300/80 uppercase">
          {data.title}
        </p>
        <p
          className={[
            'mt-3 text-zinc-100',
            isExpanded ? 'text-xl leading-8' : 'text-base leading-7',
          ].join(' ')}
        >
          {data.prompt}
        </p>
      </div>

      <div className="relative z-10 grid gap-3">
        {normalizedOptions.map((option, index) => {
          const isSelected = selectedOptionId === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={async () => {
                if (isLocked) return

                setSelectedOptionId(option.id)
                await sendMessage(option.label)
              }}
              disabled={isLocked}
              className={[
                'group w-full rounded-xl border px-4 py-3 text-left transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:outline-none',
                isLocked ? 'cursor-not-allowed opacity-90' : '',
                isSelected
                  ? 'border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_18px_rgba(52,211,153,0.22)]'
                  : 'border-zinc-800 bg-zinc-900/70 hover:border-emerald-400/45 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)]',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                    isSelected
                      ? 'border-emerald-300 bg-emerald-400/20 text-emerald-200'
                      : 'border-zinc-700 text-zinc-400 group-hover:border-emerald-300/50 group-hover:text-emerald-200',
                  ].join(' ')}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-zinc-100">
                  {option.label}
                </span>
              </div>
              {option.description ? (
                <p className="mt-2 pl-9 text-xs leading-5 text-zinc-300/90">
                  {option.description}
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
