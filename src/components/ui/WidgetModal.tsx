import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type JSX, type ReactNode } from 'react'

interface WidgetModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const widgetModalTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.95,
} as const

export const WidgetModal = ({
  isOpen,
  onClose,
  children,
}: WidgetModalProps): JSX.Element => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-zinc-950/88 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            transition={widgetModalTransition}
            className="fixed top-1/2 left-1/2 z-10 max-h-[86vh] w-[min(96vw,1200px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl"
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
