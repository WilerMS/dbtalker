import { Send } from 'lucide-react'
import type { FormEvent, JSX } from 'react'

interface ChatComposerProps {
  draft: string
  isLoading: boolean
  onDraftChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export const ChatComposer = ({
  draft,
  isLoading,
  onDraftChange,
  onSubmit,
}: ChatComposerProps): JSX.Element => {
  return (
    <div className="pointer-events-none sticky bottom-0 z-10 px-4 pt-6 pb-4 sm:px-6">
      <form
        onSubmit={(event) => {
          void onSubmit(event)
        }}
        className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-3 backdrop-blur-md transition-shadow duration-300 focus-within:border-emerald-400/50 focus-within:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
      >
        <input
          value={draft}
          onChange={(event) => {
            onDraftChange(event.target.value)
          }}
          placeholder="Pregunta por un esquema, un KPI o una tabla..."
          className="h-12 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={isLoading || !draft.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-emerald-400 transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
