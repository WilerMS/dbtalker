import { useEffect, useRef } from 'react'

interface UseDelayedHideReturn {
  cancelHide: () => void
  scheduleHide: () => void
}

export const useDelayedHide = (
  onHide: () => void,
  delay = 200,
): UseDelayedHideReturn => {
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimeout.current !== null) {
        clearTimeout(hideTimeout.current)
      }
    }
  }, [])

  const cancelHide = () => {
    if (hideTimeout.current !== null) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
  }

  const scheduleHide = () => {
    cancelHide()
    hideTimeout.current = setTimeout(() => {
      onHide()
    }, delay)
  }

  return { cancelHide, scheduleHide }
}
