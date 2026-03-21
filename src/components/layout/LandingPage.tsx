import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { Terminal } from 'lucide-react'

export const LandingPage = (): JSX.Element => {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 text-center text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(52,211,153,0.16), transparent 35%), radial-gradient(circle at 78% 82%, rgba(16,185,129,0.08), transparent 40%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(63,63,70,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(63,63,70,0.16) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          maskImage:
            'linear-gradient(180deg, rgba(0,0,0,0.56), rgba(0,0,0,0.16) 72%, transparent)',
        }}
      />

      <section className="relative z-10 mx-auto max-w-4xl">
        <h1 className="text-5xl leading-tight font-bold tracking-tight text-zinc-100 sm:text-6xl md:text-7xl">
          Talk to your{' '}
          <span className="text-emerald-400 [text-shadow:0_0_16px_rgba(52,211,153,0.48)]">
            database
          </span>
          .
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          DBTalker is an AI-powered Text-to-SQL assistant. Connect your
          database, ask questions in plain English, and get instant queries,
          charts, and schema visualizations.
        </p>

        <Link
          to="/app"
          className="mt-10 inline-flex animate-[pulse_2.8s_ease-in-out_infinite] items-center gap-3 rounded-full border border-emerald-500/50 bg-zinc-900/80 px-8 py-4 text-sm font-semibold tracking-[0.08em] text-emerald-200 uppercase shadow-[0_0_16px_rgba(52,211,153,0.22)] transition-all duration-300 hover:bg-emerald-950/30 hover:text-emerald-100 hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <Terminal className="size-5" aria-hidden="true" />
          Launch DBTalker
        </Link>
      </section>
    </main>
  )
}
