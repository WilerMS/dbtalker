import type { JSX } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Database, Zap } from 'lucide-react'

import { Logo } from '../components/ui/Logo'

export const MainPage = (): JSX.Element => {
  const easeOut = [0.16, 1, 0.3, 1] as const
  const easeInOut = [0.45, 0, 0.55, 1] as const

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  }

  const glowVariants: Variants = {
    animate: {
      boxShadow: [
        '0_0_20px_rgba(52,211,153,0.2)',
        '0_0_35px_rgba(52,211,153,0.4)',
        '0_0_20px_rgba(52,211,153,0.2)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Animated background gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 right-0 size-80 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: easeInOut,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 size-96 rounded-full bg-emerald-600/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: easeInOut,
          }}
        />
      </div>

      {/* Content */}
      <motion.section
        className="relative z-10 mx-auto max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon animation */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.div variants={glowVariants} animate="animate">
            <Logo className="h-20! w-20! border-2 p-3! [&>svg]:size-8" />
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-4xl leading-tight font-bold tracking-tight text-zinc-100"
          variants={itemVariants}
        >
          ¡Bienvenido a{' '}
          <span className="text-emerald-400 [text-shadow:0_0_16px_rgba(52,211,153,0.48)]">
            DBTalkie
          </span>
          !
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-md mt-6 text-zinc-400"
          variants={itemVariants}
        >
          Tu asistente de IA para hablar con cualquier base de datos.
        </motion.p>

        {/* Instructions section */}
        <motion.div
          className="mt-12 space-y-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 backdrop-blur-md"
          variants={itemVariants}
        >
          <div className="text-left">
            <p className="text-sm font-semibold tracking-[0.14em] text-emerald-300/90 uppercase [text-shadow:0_0_12px_rgba(52,211,153,0.28)]">
              Empieza en segundos
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-300">
              Elige una opcion para empezar:
              <span className="font-semibold text-emerald-200 [text-shadow:0_0_12px_rgba(52,211,153,0.35)]">
                {' '}
                usa la base de prueba o conecta la tuya
              </span>
              .
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 p-5 text-left">
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-950/45 shadow-[0_0_14px_rgba(52,211,153,0.24)]">
                  <span className="text-xs font-black text-emerald-200">1</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">
                  <span className="font-semibold text-zinc-100">
                    Usa la base de datos de prueba.
                  </span>{' '}
                  Lanza una demo al instante con la base que ya te
                  proporcionamos.
                </p>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-zinc-700/70 to-transparent" />

              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-950/45 shadow-[0_0_14px_rgba(52,211,153,0.24)]">
                  <span className="text-xs font-black text-emerald-200">2</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">
                  <span className="font-semibold text-zinc-100">
                    Agrega tu propia base de datos.
                  </span>{' '}
                  Conecta tus datos reales y consulta todo desde una sola
                  interfaz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
          variants={itemVariants}
        >
          <a
            href="#try-demo"
            className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-zinc-900/80 px-8 py-3 font-semibold text-emerald-200 backdrop-blur-md transition-all duration-300 hover:bg-emerald-950/30 hover:text-emerald-100 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <Database className="size-5" strokeWidth={1.5} />
            <span>Usar Base de Prueba</span>
          </a>

          <button
            className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/50 px-8 py-3 font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-950/20 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            disabled
          >
            <Zap className="size-5" strokeWidth={1.5} />
            <span>Conectar Nueva BD</span>
          </button>
        </motion.div>

        {/* Hackathon Easter egg */}
        <motion.p
          className="mt-10 text-xs tracking-widest text-zinc-600 uppercase"
          variants={itemVariants}
        >
          💪 Built with passion at the hackathon • Code like you mean it
        </motion.p>
      </motion.section>
    </div>
  )
}
