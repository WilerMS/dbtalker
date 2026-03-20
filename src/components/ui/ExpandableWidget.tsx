import { Maximize2 } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useState, type JSX, type ReactNode } from 'react'

import { WidgetModal } from './WidgetModal'

interface ExpandableWidgetProps {
  widgetId: string
  children: ReactNode
}

const widgetTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.95,
} as const

export const ExpandableWidget = ({
  widgetId,
  children,
}: ExpandableWidgetProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const layoutId = `widget-layout-${widgetId}`

  return (
    <LayoutGroup id={layoutId}>
      <div className="relative">
        <AnimatePresence initial={false}>
          {!isExpanded ? (
            <motion.div
              layoutId={layoutId}
              transition={widgetTransition}
              className="relative"
            >
              {children}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-200 transition-all duration-300 hover:border-emerald-400/70 hover:text-emerald-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.45)]"
                aria-label="Maximizar widget"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <WidgetModal isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
          <motion.div
            layoutId={layoutId}
            transition={widgetTransition}
            className="relative"
          >
            {children}
          </motion.div>
        </WidgetModal>
      </div>
    </LayoutGroup>
  )
}
