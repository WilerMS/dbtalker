import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface AuxPanelWrapperProps {
  isOpen: boolean
  anchorRect?: DOMRect
  onMouseEnter: () => void
  onMouseLeave: () => void
  children: ReactNode
}

const PANEL_MIN_HEIGHT = 350
const PANEL_WIDTH = 300
const PANEL_BASE_SHADOW =
  '0 8px 40px rgba(0,0,0,0.55), 0 0 40px rgba(16,185,129,0.18), 0 0 0 1px rgba(16,185,129,0.07)'

const computePosition = (rect?: DOMRect): { top: number; left: number } => {
  if (!rect) return { top: 0, left: 92 }
  const wouldOverflowBottom = rect.top + PANEL_MIN_HEIGHT > window.innerHeight
  return {
    top: wouldOverflowBottom ? rect.bottom - PANEL_MIN_HEIGHT : rect.top,
    left: 92,
  }
}

export const AuxPanelWrapper = ({
  isOpen,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
  children,
}: AuxPanelWrapperProps) => {
  const pos = computePosition(anchorRect)

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          key="aux-panel"
          initial={{
            opacity: 0,
            x: -8,
            top: pos.top,
            left: pos.left,
            boxShadow: PANEL_BASE_SHADOW,
          }}
          animate={{
            opacity: 1,
            x: 0,
            top: pos.top,
            left: pos.left,
            // boxShadow: [
            //   PANEL_BASE_SHADOW,
            //   PANEL_GLOW_SHADOW,
            //   PANEL_BASE_SHADOW,
            // ],
          }}
          exit={{ opacity: 0, x: -8 }}
          transition={{
            duration: 0.18,
            ease: 'easeOut',
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            position: 'fixed',
            width: PANEL_WIDTH,
            height: PANEL_MIN_HEIGHT,
            zIndex: 50,
          }}
          className="flex flex-col rounded-2xl border border-zinc-700/40 bg-linear-to-b from-zinc-900/90 via-emerald-950/60 to-zinc-900/88 backdrop-blur-md"
        >
          {children}
        </motion.section>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
