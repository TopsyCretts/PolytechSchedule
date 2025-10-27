import { useCallback, useRef, useState } from "react"

export const useDragDetection = (threshold = 0) => {
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPos.current = { x: clientX, y: clientY }
    setIsDragging(false)
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!startPos.current.x && !startPos.current.y) return

      const deltaX = Math.abs(clientX - startPos.current.x)
      const deltaY = Math.abs(clientY - startPos.current.y)

      if (deltaX > threshold || deltaY > threshold) {
        setIsDragging(true)
      }
    },
    [threshold]
  )

  const handleEnd = useCallback(() => {
    startPos.current = { x: 0, y: 0 }
    const wasDragging = isDragging
    setIsDragging(false)
    return wasDragging
  }, [isDragging])

  // Мышь
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX, e.clientY)
    },
    [handleStart]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove]
  )

  const onMouseUp = useCallback(() => {
    return handleEnd()
  }, [handleEnd])

  // Тач
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    },
    [handleStart]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    },
    [handleMove]
  )

  const onTouchEnd = useCallback(() => {
    return handleEnd()
  }, [handleEnd])

  return {
    // Для мыши
    onMouseDown,
    onMouseMove,
    onMouseUp,
    // Для тач
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    // Состояние
    isDragging,
  }
}