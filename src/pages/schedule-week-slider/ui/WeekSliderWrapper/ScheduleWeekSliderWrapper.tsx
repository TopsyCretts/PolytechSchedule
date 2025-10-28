import { useDragDetection } from "@/pages/schedule-week-slider/lib/useDragDetection.ts"
import type { SwiperRef } from "swiper/react"

interface WeekSliderWrapperProps {
  children: React.ReactNode
  swiperRef: SwiperRef | null
}

const ScheduleWeekSliderWrapper = ({
  children,
  swiperRef,
}: WeekSliderWrapperProps) => {
  const {
    onTouchStart: onTopTouchStart,
    onTouchEnd: onTopTouchEnd,
    onTouchMove: onTopTouchMove,
  } = useDragDetection()

  const {
    onTouchStart: onBottomTouchStart,
    onTouchEnd: onBottomTouchEnd,
    onTouchMove: onBottomTouchMove,
  } = useDragDetection()

  const handleTopZoneInteraction = (e: React.TouchEvent) => {
    onTopTouchStart(e)
  }
  const handleTopZoneMove = (e: React.TouchEvent) => {
    onTopTouchMove(e)
  }
  const handleTopZoneEnd = () => {
    const wasDragging = onTopTouchEnd()
    if (wasDragging && swiperRef && !swiperRef.swiper.isBeginning) {
      swiperRef.swiper.slidePrev()
    }
  }

  const handleBottomZoneInteraction = (e: React.TouchEvent) => {
    onBottomTouchStart(e)
  }
  const handleBottomZoneMove = (e: React.TouchEvent) => {
    onBottomTouchMove(e)
  }
  const handleBottomZoneEnd = () => {
    const wasDragging = onBottomTouchEnd()
    if (wasDragging && swiperRef && !swiperRef.swiper.isEnd) {
      swiperRef.swiper.slideNext()
    }
  }

  return (
    <div
      className="swiper-container"
      style={{ position: "relative", height: 700 }}
    >
      <DragHandler
        onTouchStart={handleTopZoneInteraction}
        onTouchMove={handleTopZoneMove}
        onTouchEnd={handleTopZoneEnd}
        type={"up"}
      />
      {children}
      <DragHandler
        onTouchStart={handleBottomZoneInteraction}
        onTouchMove={handleBottomZoneMove}
        onTouchEnd={handleBottomZoneEnd}
        type={"down"}
      />
    </div>
  )
}

export default ScheduleWeekSliderWrapper

interface DragHandleProps {
  onTouchStart: (event: React.TouchEvent) => void
  onTouchMove: (event: React.TouchEvent) => void
  onTouchEnd: (event: React.TouchEvent) => void
  type: "up" | "down"
}

const DragHandler = ({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  type,
}: DragHandleProps) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: type === "down" ? 0 : undefined,
        top: type === "up" ? 0 : undefined,
        left: 0,
        right: 0,
        marginTop:
          type === "up" ? "calc(var(--button-height) + 2*1.25rem)" : undefined,
        height: type === "up" ? "50px" : "200px",
        zIndex: 10,
        cursor: "grab",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        // Получаем элемент под курсором
        const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY)
        const elementBelow = elementsBelow.find(
          (value) => value.tagName === "BUTTON" || value.tagName === "A"
        )
        if (elementBelow) {
          const mouseEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: e.clientX,
            clientY: e.clientY,
          })
          elementBelow.dispatchEvent(mouseEvent)
        }
      }}
    />
  )
}
