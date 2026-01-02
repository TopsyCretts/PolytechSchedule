import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { WeekSlider } from "@/shared/ui"
import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type SwiperRef } from "swiper/react"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import { add, type Day, isAfter, isBefore, isEqual, sub } from "date-fns"
import { findWeekSlide } from "@/pages/schedule-week-slider/lib/findWeekSlide.ts"
import "./ScheduleWeekView.scss"
import ScheduleWeekViewController from "@/pages/schedule-week-slider/ui/ScheduleWeekVIewController"
import ScheduleWeekViewSubHeader from "@/pages/schedule-week-slider/ui/ScheduleWeekViewSubHeader"
import ScheduleWeekViewControllerMobile from "@/pages/schedule-week-slider/ui/ScheduleWeekViewControllerMobile"
import { AnimatePresence, motion } from "framer-motion"
import ArrowIcon from "@/assets/icons/arrow-long-right.svg?react"
import clsx from "clsx"
import {
  useGetDateFromUrl,
  useSetDateToUrl,
} from "@/shared/lib/useDayFromSearchParams.ts"
import getWeekDataByWeekStart from "@/pages/schedule-week-slider/lib/getWeekDataByWeekStart.ts"
import {
  maxWeekStartDate,
  minWeekStartDate,
} from "@/pages/schedule-week-slider/lib/minAndMaxWeekStartDate.ts"

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

  const { dateFromUrl } = useGetDateFromUrl()
  const { setDateToUrl } = useSetDateToUrl()

  const [isNotFirstRender, setNotFirstRender] = useState(false)

  useEffect(() => {
    setNotFirstRender(true)
  }, [])

  const [currentWeek, setCurrentWeek] = useState<SelectedWeekSlide>(
    findWeekSlide(data.weeks, dateFromUrl)
  )

  const goToIndex = useCallback((index: number) => {
    swiperRef.current?.swiper?.slideTo(index)
  }, [])

  useEffect(() => {
    const currentDay =
      currentWeek.weekData.days[currentWeek.activeDateIndex]?.date
    if (currentDay && isEqual(dateFromUrl, currentDay)) {
      return
    }
    const newSlide = findWeekSlide(data.weeks, dateFromUrl)
    if (isEqual(newSlide.weekData.start, currentWeek.weekData.start)) {
      if (newSlide.activeDateIndex === currentWeek.activeDateIndex) {
        return
      }
      goToIndex(newSlide.activeDateIndex)
      return
    }
    handleWeekSelection(newSlide.weekData, newSlide.activeDateIndex)
  }, [dateFromUrl, goToIndex])

  const [animationDirection, setAnimationDirection] = useState(1)

  const handleWeekSelection = useCallback(
    (weekData: ScheduleWeekData, initialDay?: number) => {
      const newWeekStart = weekData.start
      const currentWeekStart = currentWeek.weekData.start
      if (isAfter(newWeekStart, currentWeekStart)) {
        setAnimationDirection(1)
      } else {
        setAnimationDirection(-1)
      }
      setCurrentWeek((prev) => ({
        weekData: weekData,
        activeDateIndex: initialDay ?? prev.activeDateIndex,
      }))
    },
    [currentWeek, data.weeks]
  )

  const handleNextWeek = (forceInitialDate: number | null = null) => {
    const maxWeekStart = maxWeekStartDate()
    const nextWeekStart = add(currentWeek.weekData.start, { weeks: 1 })
    if (isAfter(nextWeekStart, maxWeekStart)) {
      return
    }
    const weekData = getWeekDataByWeekStart(data.weeks, nextWeekStart)
    handleWeekSelection(weekData, forceInitialDate ? forceInitialDate : 0)
  }

  const handlePrevWeek = (forceInitialDate: number | null = null) => {
    const minWeekStart = minWeekStartDate()
    const prevWeekStart = sub(currentWeek.weekData.start, { weeks: 1 })
    if (isBefore(prevWeekStart, minWeekStart)) {
      return
    }
    const weekData = getWeekDataByWeekStart(data.weeks, prevWeekStart)
    handleWeekSelection(weekData, forceInitialDate ? forceInitialDate : 6)
  }

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

      const canSwipeUp = swipe.isAtBottom && isSwipingUp
      const canSwipeDown = swipe.isAtTop && isSwipingDown

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
      if (swipe.isAtBottom && deltaY < 0) {
        handleNextWeek(currentWeek.activeDateIndex)
      } else if (swipe.isAtTop && deltaY > 0) {
        handlePrevWeek(currentWeek.activeDateIndex)
      }
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

  const variants = useMemo(
    () => ({
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
    }),
    []
  )

  const handleSlideChange = useCallback(
    (newActiveIndex: number, newDay: Date) => {
      if (newDay && isNotFirstRender) {
        setDateToUrl(newDay)
      }
      setCurrentWeek((prev) => ({
        ...prev,
        activeDateIndex: newActiveIndex,
      }))
    },
    [isNotFirstRender, setDateToUrl]
  )

  return (
    <section className={clsx("schedule-week-view", "overflow-x-hidden")}>
      <header className={"schedule-week-view__header"}>
        <ScheduleWeekViewSubHeader
          handleWeekSelection={handleWeekSelection}
          selectedWeek={{
            startDate: currentWeek.weekData.start,
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
            key={currentWeek.weekData.start.toString()}
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <WeekSlider
              swiperRef={swiperRef}
              initialDay={currentWeek.activeDateIndex}
              weekData={currentWeek.weekData}
              locale={locale}
              profileType={profile.profileType}
              onSlideChange={handleSlideChange}
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
