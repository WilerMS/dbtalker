import { AnimatePresence, motion, type Transition } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import {
  ModalContext,
  type ModalContextValue,
  type ModalSize,
  type OpenModalOptions,
} from './modalContext'

interface ModalState extends OpenModalOptions {
  isOpen: boolean
}

interface ModalProviderProps {
  children: ReactNode
}

const modalTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
}

const overlayTransition = {
  duration: 0.22,
  ease: 'easeOut',
} as const

const resolveSizeValue = (
  value: ModalSize[keyof ModalSize],
): string | number | undefined => {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

export const ModalProvider = ({
  children,
}: ModalProviderProps): JSX.Element => {
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const closeModal = useCallback(() => {
    setModalState((currentState) => {
      if (!currentState) {
        return currentState
      }

      return {
        ...currentState,
        isOpen: false,
      }
    })
  }, [])

  const openModal = useCallback((options: OpenModalOptions) => {
    setModalState({
      ...options,
      closeOnOverlayClick: options.closeOnOverlayClick ?? true,
      isOpen: true,
    })
  }, [])

  useEffect(() => {
    if (!modalState?.isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeModal, modalState?.isOpen])

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      closeModal,
      isOpen: modalState?.isOpen ?? false,
      openModal,
    }),
    [closeModal, modalState?.isOpen, openModal],
  )

  const modalStyle: CSSProperties | undefined = modalState
    ? {
        width: resolveSizeValue(modalState.size?.width ?? 'min(92vw, 780px)'),
        maxWidth: resolveSizeValue(modalState.size?.maxWidth),
        height: resolveSizeValue(modalState.size?.height),
        maxHeight: resolveSizeValue(modalState.size?.maxHeight ?? '88vh'),
      }
    : undefined

  const modalContent =
    typeof modalState?.content === 'function'
      ? modalState.content({ closeModal })
      : modalState?.content

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {typeof document === 'undefined'
        ? null
        : createPortal(
            <AnimatePresence
              onExitComplete={() => {
                setModalState((currentState) => {
                  if (!currentState || currentState.isOpen) {
                    return currentState
                  }

                  return null
                })
              }}
            >
              {modalState?.isOpen ? (
                <motion.div
                  aria-modal="true"
                  role="dialog"
                  className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={overlayTransition}
                >
                  <button
                    type="button"
                    aria-label="Cerrar modal"
                    className="absolute inset-0 bg-zinc-950/86 backdrop-blur-md"
                    onClick={() => {
                      if (modalState.closeOnOverlayClick ?? true) {
                        closeModal()
                      }
                    }}
                  />

                  <motion.div
                    style={modalStyle}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={modalTransition}
                    className="relative z-10 w-full overflow-hidden rounded-[28px] border border-emerald-400/18 bg-zinc-900/88 shadow-[0_20px_70px_rgba(0,0,0,0.52),0_0_44px_rgba(16,185,129,0.14)] ring-1 ring-white/6 backdrop-blur-xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_38%),linear-gradient(180deg,rgba(16,185,129,0.05),transparent_42%)]" />
                    <div className="relative max-h-[88vh] overflow-y-auto">
                      {modalContent}
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )}
    </ModalContext.Provider>
  )
}
