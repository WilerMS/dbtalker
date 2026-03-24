import type { JSX } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { DatabaseRecord } from '../../../types/database'
import {
  SidePanelConversationList,
  type ConversationItem,
} from './SidePanelConversationList'
import { SidePanelDatabaseActions } from './SidePanelDatabaseActions'

const PANEL_MIN_HEIGHT = 350
const PANEL_WIDTH = 300
const SIDEPANEL_WIDTH = 80
const GAP = 12
const PANEL_BASE_SHADOW =
  '0 8px 40px rgba(0,0,0,0.55), 0 0 40px rgba(16,185,129,0.18), 0 0 0 1px rgba(16,185,129,0.07)'
const PANEL_GLOW_SHADOW =
  '0 10px 44px rgba(0,0,0,0.58), 0 0 52px rgba(52,211,153,0.22), 0 0 0 1px rgba(52,211,153,0.1)'

interface SidePanelAuxPanelProps {
  anchorRect: DOMRect | null
  database: DatabaseRecord | null
  conversations: ConversationItem[]
  isLoading?: boolean
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onEditDatabase: () => void
  onDeleteDatabase: () => void
  onDeleteConversation: (conversationId: string) => void
  onClickConversation: (conversationId: string) => void
  onClickNewConversation: () => void
}

const computePosition = (rect: DOMRect): { top: number; left: number } => {
  const left = SIDEPANEL_WIDTH + GAP
  const wouldOverflowBottom = rect.top + PANEL_MIN_HEIGHT > window.innerHeight

  return {
    top: wouldOverflowBottom ? rect.bottom - PANEL_MIN_HEIGHT : rect.top,
    left,
  }
}

export const SidePanelAuxPanel = ({
  anchorRect,
  database,
  conversations,
  isLoading = false,
  isVisible,
  onMouseEnter,
  onMouseLeave,
  onEditDatabase,
  onDeleteDatabase,
  onDeleteConversation,
  onClickConversation,
  onClickNewConversation,
}: SidePanelAuxPanelProps): JSX.Element => {
  const pos = anchorRect
    ? computePosition(anchorRect)
    : { top: 0, left: SIDEPANEL_WIDTH + GAP }

  return createPortal(
    <AnimatePresence>
      {isVisible && anchorRect && database && (
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
            boxShadow: [
              PANEL_BASE_SHADOW,
              PANEL_GLOW_SHADOW,
              PANEL_BASE_SHADOW,
            ],
          }}
          exit={{ opacity: 0, x: -8 }}
          transition={{
            duration: 0.18,
            ease: 'easeOut',
            boxShadow: {
              duration: 7.5,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: 'easeInOut',
            },
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
          <header className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
                Base de datos
              </p>
              <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">
                {database.name}
              </h3>
            </div>

            <SidePanelDatabaseActions
              compact
              onEdit={onEditDatabase}
              onDelete={onDeleteDatabase}
            />
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 py-3">
            <p className="px-4 text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
              Conversaciones historicas
            </p>
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs text-zinc-400">Cargando...</span>
                </div>
              </div>
            ) : (
              <SidePanelConversationList
                conversations={conversations}
                onDeleteConversation={onDeleteConversation}
                onClickConversation={onClickConversation}
              />
            )}
          </div>

          <div className="border-t border-zinc-800/80 p-3">
            <button
              type="button"
              onClick={onClickNewConversation}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 ease-out hover:border-emerald-400/25 hover:bg-emerald-400/8 hover:text-zinc-100 hover:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:border-emerald-400/25 focus-visible:bg-emerald-400/8 focus-visible:text-zinc-100 focus-visible:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:outline-none"
            >
              <Plus size={14} />
              <span>Nueva conversacion</span>
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>,
    document.body,
  )
}
