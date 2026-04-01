import { motion } from 'framer-motion'

interface QueryingStatusWidgetProps {
  text: string
}

export const QueryingStatusWidget = ({ text }: QueryingStatusWidgetProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/35 bg-zinc-900/70 p-4 backdrop-blur-md">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/12 to-transparent"
        initial={{ x: '-120%' }}
        animate={{ x: '120%' }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-2 w-2 rounded-full bg-emerald-400"
              animate={{
                opacity: [0.25, 1, 0.25],
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.15,
              }}
            />
          ))}
        </div>

        <motion.p
          className="text-sm font-medium tracking-wide text-emerald-300"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      </div>
    </div>
  )
}
