import type { FC } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Database, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/react'
import { dark } from '@clerk/themes'

import { Logo } from '../components/ui/Logo'
import { useCreateConversation } from '../hooks/useConversations/useCreateConversation'
import { useModal } from '../hooks/useModal'
import { CreateDatabaseModalContent } from '../components/sidepanel/components/database-manager'

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

const DEFAULT_DATABASE_ID = '83d48401c6f4447283184ebd610148f5'

export const MainPage: FC = () => {
  const navigate = useNavigate()
  const { createConversation, isPending } = useCreateConversation()
  const { openModal } = useModal()
  const { isSignedIn } = useUser()
  const { openSignIn } = useClerk()

  const handleGoToDemo = async () => {
    const newConversation = await createConversation({
      database_id: DEFAULT_DATABASE_ID,
      title: 'Nueva conversacion',
    })

    const newPath = `/app/${DEFAULT_DATABASE_ID}/conversations/${newConversation.id}`

    await navigate(newPath, { viewTransition: true })
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <motion.section
        className="relative z-10 mx-auto max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.div variants={glowVariants} animate="animate">
            <Logo className="h-20! w-20! border-2 p-3! [&>svg]:size-8" />
          </motion.div>
        </motion.div>

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

        <motion.p
          className="text-md mt-6 text-zinc-400"
          variants={itemVariants}
        >
          Tu asistente de IA para hablar con cualquier base de datos.
        </motion.p>

        <motion.div
          className="mt-12 space-y-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 backdrop-blur-md"
          variants={itemVariants}
          style={{
            viewTransitionName: 'container-to-input',
          }}
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
          <button
            onClick={(event) => {
              event.preventDefault()
              void handleGoToDemo()
            }}
            aria-disabled={isPending}
            className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-500/50 bg-zinc-900/80 px-5 py-3 font-semibold text-emerald-200 backdrop-blur-md transition-all duration-300 hover:bg-emerald-950/30 hover:text-emerald-100 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            style={{
              pointerEvents: isPending ? 'none' : 'auto',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            <Database className="size-5" strokeWidth={1.5} />
            <span>Usar BD de Prueba</span>
          </button>

          <button
            className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/50 px-5 py-3 font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-950/20 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            onClick={() => {
              if (!isSignedIn) {
                return openSignIn({ appearance: { theme: dark } })
              }

              openModal({
                size: {
                  width: 'min(94vw, 750px)',
                  maxHeight: '90vh',
                },
                content: ({ closeModal }) => (
                  <CreateDatabaseModalContent
                    onClose={closeModal}
                    onCreationSuccess={(databaseId, conversationId) => {
                      navigate(
                        `/app/${databaseId}/conversations/${conversationId}`,
                        {
                          viewTransition: true,
                        },
                      )
                    }}
                  />
                ),
              })
            }}
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
          🚧 Solo Postgres soportado por ahora — ¡más motores en camino!
        </motion.p>
      </motion.section>
    </div>
  )
}
