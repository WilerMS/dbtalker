import { createContext, type ReactNode } from 'react'

export interface ModalSize {
  width?: number | string
  maxWidth?: number | string
  height?: number | string
  maxHeight?: number | string
}

export interface ModalControls {
  closeModal: () => void
}

export type ModalContent = ReactNode | ((controls: ModalControls) => ReactNode)

export interface OpenModalOptions {
  content: ModalContent
  size?: ModalSize
  closeOnOverlayClick?: boolean
}

export interface ModalContextValue {
  closeModal: () => void
  isOpen: boolean
  openModal: (options: OpenModalOptions) => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)
