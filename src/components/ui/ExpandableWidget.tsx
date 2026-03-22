import { Maximize, Minimize } from 'lucide-react'
import { LayoutGroup, motion } from 'framer-motion'
import { useState, type JSX, type ReactNode } from 'react'

import { WidgetModal, type WidgetModalSize } from './WidgetModal'

interface ExpandableWidgetRenderProps {
  isExpanded: boolean
}

type ExpandableWidgetChildren =
  | ReactNode
  | ((props: ExpandableWidgetRenderProps) => ReactNode)

interface ExpandableWidgetProps {
  widgetId: string
  children: ExpandableWidgetChildren
  expandedSize?: WidgetModalSize
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
  expandedSize,
}: ExpandableWidgetProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const layoutId = `widget-layout-${widgetId}`
  const renderedChildren =
    typeof children === 'function' ? children({ isExpanded }) : children

  return (
    <LayoutGroup id={layoutId}>
      <div className="relative">
        <motion.div
          layoutId={layoutId}
          transition={widgetTransition}
          className={`relative ${isExpanded ? 'invisible' : ''}`}
          aria-hidden={isExpanded}
        >
          {renderedChildren}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={`absolute top-6 right-6 z-10 cursor-pointer text-zinc-300 transition-all duration-200 ease-out hover:scale-125 hover:text-emerald-400 active:scale-90 ${isExpanded ? 'pointer-events-none opacity-0' : ''}`}
            aria-label="Maximizar widget"
            tabIndex={isExpanded ? -1 : 0}
          >
            <Maximize className="h-5 w-5" />
          </button>
        </motion.div>

        <WidgetModal
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          size={expandedSize}
        >
          <motion.div
            layoutId={layoutId}
            transition={widgetTransition}
            className="relative"
          >
            {renderedChildren}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-10 cursor-pointer text-zinc-300 transition-all duration-200 ease-out hover:scale-125 hover:text-emerald-400 active:scale-90"
              aria-label="Minimizar widget"
            >
              <Minimize className="h-5 w-5" />
            </button>
          </motion.div>
        </WidgetModal>
      </div>
    </LayoutGroup>
  )
}
