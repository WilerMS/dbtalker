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
          className="text-4xl leading-tight font-bold tracking-tight text-zinc-100 sm:text-5xl"
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
          className="mt-6 text-lg text-zinc-400 sm:text-xl"
          variants={itemVariants}
        >
          Tu asistente de IA para hablar con cualquier base de datos. 🚀
        </motion.p>

        {/* Instructions section */}
        <motion.div
          className="mt-12 space-y-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 backdrop-blur-md"
          variants={itemVariants}
        >
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex size-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-950/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold text-emerald-300">
                  1
                </span>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">
                  Abre la base de datos en el panel izquierdo
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Haz click en una de las bases de datos disponibles para
                  empezar a chatear.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex size-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-950/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold text-emerald-300">
                  2
                </span>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">
                  Usa nuestra base de datos de prueba
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Tenemos una base de datos lista para que explores todo el
                  poder de DBTalkie. ¡Sin configuración! 🎯
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex size-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-950/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold text-emerald-300">
                  3
                </span>
              </div>
              <div>
                <p className="font-semibold text-zinc-100">
                  Conecta tu propia base de datos
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  ¿Quieres conquistar el mundo con tus datos? Usa el botón
                  debajo para conectar tu base de datos. 💪
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
            className="group relative inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/50 px-8 py-3 font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-950/20 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
