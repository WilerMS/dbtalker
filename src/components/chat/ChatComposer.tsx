import { Send, Sparkles } from 'lucide-react'
import type { JSX, ChangeEvent, KeyboardEvent, SubmitEvent } from 'react'
import './ChatComposer.css'

interface ChatComposerProps {
  draft: string
  isLoading: boolean
  onDraftChange: (value: string) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
}

export const ChatComposer = ({
  draft,
  isLoading,
  onDraftChange,
  onSubmit,
}: ChatComposerProps): JSX.Element => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form && draft.trim() && !isLoading) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-zinc-950/80 via-zinc-950/45 to-transparent pb-6 backdrop-blur-md">
      <div className="pointer-events-none absolute -top-16 right-0 left-0 h-16 bg-linear-to-t from-zinc-950/95 via-zinc-950/70 to-transparent" />
      <div className="pointer-events-auto mx-auto max-w-210 px-4">
        <div className="group relative animate-[borderGlow_3s_ease-in-out_infinite] rounded-2xl bg-[linear-gradient(90deg,rgba(52,211,153,0.3),rgba(16,185,129,0.5),rgba(52,211,153,0.3))] bg-size-[200%_200%] p-px shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all duration-300 ease-in-out focus-within:shadow-[0_0_25px_rgba(52,211,153,0.3),0_0_50px_rgba(52,211,153,0.15)] hover:bg-[rgba(52,211,153,0.5)]">
          <form
            onSubmit={(event) => {
              void onSubmit(event)
            }}
            className="relative rounded-2xl bg-zinc-900/75 backdrop-blur-xl transition-all duration-300"
          >
            <div className="flex items-end gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <Sparkles className="h-4 w-4 text-emerald-400 transition-colors duration-300 group-hover:text-emerald-200" />
              </div>

              <textarea
                value={draft}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  onDraftChange(event.target.value)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta por un esquema, un KPI o una tabla..."
                disabled={isLoading}
                rows={1}
                className="field-sizing-content max-h-40 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent py-1.5 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!draft.trim() || isLoading}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 transition-all duration-300 ease-in-out ${
                  draft.trim() && !isLoading
                    ? 'text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-400/20 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                    : 'cursor-not-allowed text-zinc-600'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        <p className="mt-3 text-center text-xs text-zinc-600">
          KubePath puede cometer errores. Verifica consultas importantes antes
          de ejecutar.
        </p>
      </div>
    </div>
  )
}
