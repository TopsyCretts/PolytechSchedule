import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { WeekSlider } from "@/shared/ui"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { type SwiperRef } from "swiper/react"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import { type Day } from "date-fns"
import { findWeekSlide } from "@/pages/schedule-week-slider/lib/findWeekSlide.ts"
import "./ScheduleWeekView.scss"
import ScheduleWeekViewController from "@/pages/schedule-week-slider/ui/ScheduleWeekVIewController"
import ScheduleWeekViewSubHeader from "@/pages/schedule-week-slider/ui/ScheduleWeekViewSubHeader"
import ScheduleWeekViewControllerMobile from "@/pages/schedule-week-slider/ui/ScheduleWeekViewControllerMobile"
import { AnimatePresence, motion } from "framer-motion"
import ArrowIcon from "@/assets/icons/arrow-long-right.svg?react"
import clsx from "clsx"
import { useGetDateFromUrl } from "@/shared/lib/useDayFromSearchParams.ts"

interface SwipeState {
  isSwiping: boolean
  startY: number
  currentY: number
  isAtTop: boolean
  isAtBottom: boolean
  initialScrollTop: number
  scrollHeight: number
}

const ScheduleWeekView = () => {
  const { data, profile, locale } = useScheduleData()

  const swiperRef = useRef<SwiperRef | null>(null)

  const { getDateFromUrl } = useGetDateFromUrl()

  const [currentWeek, setCurrentWeek] = useState<SelectedWeekSlide>(
    findWeekSlide(data.weeks, getDateFromUrl())
  )

  const [animationDirection, setAnimationDirection] = useState(1)

  const goToIndex = useCallback((index: number) => {
    swiperRef.current?.swiper?.slideTo(index)
  }, [])

  const handleWeekSelection = useCallback(
    (weekData: ScheduleWeekData) => {
      const newActiveIndex = data.weeks.indexOf(weekData)
      if (newActiveIndex !== -1) {
        if (newActiveIndex > currentWeek.index) {
          setAnimationDirection(1)
        } else {
          setAnimationDirection(-1)
        }
        setCurrentWeek({
          index: newActiveIndex,
          weekData: weekData,
          activeDateIndex: 0,
        })
      }
    },
    [currentWeek.index, data.weeks]
  )

  const handleNextWeek = useCallback(() => {
    const nextIndex = currentWeek.index + 1
    if (data.weeks.length > nextIndex) {
      const weekData = data.weeks[nextIndex]
      handleWeekSelection(weekData)
    }
  }, [handleWeekSelection])

  const handlePrevWeek = useCallback(() => {
    const nextIndex = currentWeek.index - 1
    if (nextIndex >= 0) {
      const weekData = data.weeks[nextIndex]
      handleWeekSelection(weekData)
    }
  }, [handleWeekSelection])

  const [swipe, setSwipe] = useState<SwipeState>({
    isSwiping: false,
    startY: 0,
    currentY: 0,
    isAtTop: false,
    isAtBottom: false,
    initialScrollTop: 0,
    scrollHeight: 0,
  })

  const contentRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const checkScroll = useCallback(() => {
    const element = contentRef.current
    if (element !== null) {
      const { scrollTop, scrollHeight, clientHeight } = element
      const isAtTop = scrollTop === 0
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1

      setSwipe((prev) => ({
        ...prev,
        isAtTop: isAtTop,
        isAtBottom: isAtBottom,
      }))
    }
  }, [])

  useEffect(() => {
    contentRef.current = document.getElementById(
      "week-day-" + currentWeek.activeDateIndex
    )
    checkScroll()
  }, [swiperRef.current, currentWeek, checkScroll])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const currentContent = contentRef.current
      if (currentContent) {
        checkScroll()
        const { scrollTop, scrollHeight, clientHeight } = currentContent
        const clientY = e.touches[0].clientY
        setSwipe((prev) => ({
          ...prev,
          isSwiping: true,
          startY: clientY,
          currentY: clientY,
          initialScrollTop: scrollTop,
          scrollHeight: scrollHeight - clientHeight,
        }))
      }
    },
    [checkScroll]
  )

  useEffect(() => {
    const currentWrapper = wrapperRef.current

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipe.isSwiping) {
        return
      }

      const deltaY = e.touches[0].clientY - swipe.startY
      const isSwipingUp = deltaY < 0
      const isSwipingDown = deltaY > 0

      const canSwipeUp =
        swipe.isAtBottom &&
        isSwipingUp &&
        currentWeek.index < data.weeks.length - 1
      const canSwipeDown =
        swipe.isAtTop && isSwipingDown && currentWeek.index > 0

      if (canSwipeUp || canSwipeDown) {
        if (e.cancelable) {
          e.preventDefault()
        }

        setSwipe((prev) => ({ ...prev, currentY: e.touches[0].clientY }))
      }
    }

    currentWrapper?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    })
    return () => {
      currentWrapper?.removeEventListener("touchmove", handleTouchMove)
    }
  }, [
    swipe.isAtBottom,
    swipe.isAtTop,
    swipe.isSwiping,
    contentRef.current,
    wrapperRef.current,
  ])

  const thresholdToSwipeStop = 100
  const thresholdToSwipeStart = 20

  const topHeight =
    swipe.currentY -
    swipe.startY -
    swipe.initialScrollTop -
    thresholdToSwipeStart

  const bottomHeight =
    swipe.currentY -
    swipe.startY +
    (swipe.scrollHeight + thresholdToSwipeStart - swipe.initialScrollTop)

  const showTopIndicator = swipe.isAtTop && swipe.isSwiping && topHeight > 0
  const showBottomIndicator =
    swipe.isAtBottom && swipe.isSwiping && bottomHeight < 0

  const handleTouchEnd = () => {
    if (!swipe.isSwiping) {
      return
    }

    const deltaY = showTopIndicator
      ? topHeight
      : showBottomIndicator
        ? bottomHeight
        : 0

    const absDeltaY = Math.abs(deltaY)

    if (absDeltaY >= thresholdToSwipeStop) {
      let newActiveIndex = 0
      if (
        swipe.isAtBottom &&
        deltaY < 0 &&
        data.weeks.length > currentWeek.index + 1
      ) {
        newActiveIndex = currentWeek.index + 1
        setAnimationDirection(1)
      } else if (swipe.isAtTop && deltaY > 0 && currentWeek.index - 1 >= 0) {
        newActiveIndex = currentWeek.index - 1
        setAnimationDirection(-1)
      }
      setCurrentWeek({
        activeDateIndex: 0,
        index: newActiveIndex,
        weekData: data.weeks[newActiveIndex],
      })
    }
    setSwipe((prev) => ({ ...prev, currentY: 0, startY: 0, isSwiping: false }))
  }

  const getIndicatorSize = () => {
    const deltaY = Math.abs(
      showTopIndicator ? topHeight : showBottomIndicator ? bottomHeight : 0
    )

    const maxSize = 40
    return Math.min((deltaY / thresholdToSwipeStop) * maxSize, maxSize)
  }

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  }

  return (
    <section className={clsx("schedule-week-view", "overflow-x-hidden")}>
      <header className={"schedule-week-view__header"}>
        <ScheduleWeekViewSubHeader
          handleWeekSelection={handleWeekSelection}
          selectedWeek={{
            startDate: currentWeek.weekData.start,
            index: currentWeek.index,
          }}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
        <ScheduleWeekViewControllerMobile
          className={clsx("schedule-week-view__controller", "visible-mobile-s")}
          startWeekDate={currentWeek.weekData.start}
          currentSelectedDayNumber={currentWeek.activeDateIndex as Day}
          locale={locale}
          onWeekDayClick={goToIndex}
        />
        <ScheduleWeekViewController
          className={clsx("schedule-week-view__controller", "hidden-mobile-s")}
          locale={locale}
          scheduleWeekSlider={swiperRef}
          selectedWeekSlide={currentWeek}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      </header>
      <div className={"schedule-week-view__slider-container-wrapper"}>
        <AnimatePresence
          mode={"wait"}
          custom={animationDirection}
        >
          <motion.div
            key={currentWeek.index}
            ref={wrapperRef}
            className="schedule-week-view__slider-container"
            custom={animationDirection}
            variants={variants}
            initial={"enter"}
            animate={"center"}
            exit={"exit"}
            transition={{ duration: 0.4, ease: "linear" }}
            style={{
              translateY:
                (swipe.isSwiping &&
                  (showTopIndicator
                    ? getIndicatorSize()
                    : showBottomIndicator
                      ? -getIndicatorSize()
                      : 0)) ||
                0,
            }}
            onAnimationEnd={() => goToIndex(0)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <WeekSlider
              swiperRef={swiperRef}
              initialDate={getDateFromUrl()}
              weekData={currentWeek.weekData}
              locale={locale}
              profileType={profile.profileType}
              onSlideChange={(newActiveIndex) => {
                setCurrentWeek((prev) => ({
                  ...prev,
                  activeDateIndex: newActiveIndex,
                }))
              }}
              onScroll={checkScroll}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {showTopIndicator && (
        <div
          className="schedule-week-view__indicator schedule-week-view__indicator--top"
          style={{ width: getIndicatorSize(), height: getIndicatorSize() }}
        >
          <ArrowIcon className="schedule-week-view__arrow" />
        </div>
      )}

      {showBottomIndicator && (
        <div
          className="schedule-week-view__indicator schedule-week-view__indicator--bottom"
          style={{ width: getIndicatorSize(), height: getIndicatorSize() }}
        >
          <ArrowIcon className="schedule-week-view__arrow" />
        </div>
      )}
    </section>
  )
}

export default ScheduleWeekView
