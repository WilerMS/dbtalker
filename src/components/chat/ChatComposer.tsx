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
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10">
      <div className="chat-composer-shell mx-auto lg:max-w-[90%]">
        <div className="chat-composer-shell-top pointer-events-none absolute -top-14 right-0 left-0 mx-auto h-16 max-w-210" />
        <div className="test pointer-events-auto mx-auto max-w-210 px-4 pb-6 backdrop-blur-2xl">
          <div className="chat-composer-frame group relative rounded-2xl p-px">
            <form
              onSubmit={(event) => {
                void onSubmit(event)
              }}
              className="chat-composer-form relative rounded-2xl"
            >
              <div className="flex items-end gap-3 p-4">
                <div className="chat-composer-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Sparkles className="chat-composer-icon h-4 w-4 transition-colors duration-300" />
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
                  className="chat-composer-textarea field-sizing-content max-h-40 min-h-10 flex-1 resize-none overflow-y-auto py-1.5 text-sm leading-relaxed focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || isLoading}
                  className={`chat-composer-submit flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-in-out ${
                    draft.trim() && !isLoading
                      ? 'chat-composer-submit-enabled'
                      : 'chat-composer-submit-disabled cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <p className="chat-composer-caption mt-3 text-center text-xs">
            KubePath puede cometer errores. Verifica consultas importantes antes
            de ejecutar.
          </p>
        </div>
      </div>
    </div>
  )
}
