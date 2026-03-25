import type { JSX } from 'react'

export const SettingsPage = (): JSX.Element => {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <section
        style={{ viewTransitionName: 'container-to-input' }}
        className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-[0_0_30px_rgba(16,185,129,0.12)] backdrop-blur-sm"
      >
        <h1 className="text-xl font-semibold tracking-wide text-emerald-300">
          Settings
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Settings panel is under development.
        </p>
      </section>
    </div>
  )
}
