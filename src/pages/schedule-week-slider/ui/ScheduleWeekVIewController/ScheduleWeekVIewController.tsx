import DayController from "@/shared/ui/DayController"
import {
  eachDayOfInterval,
  isSameWeek,
  isToday,
  type Locale,
  startOfToday,
} from "date-fns"
import { type RefObject, useEffect, useState } from "react"
import type { SwiperClass, SwiperRef } from "swiper/react"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"

interface ScheduleWeekViewControllerProps extends BaseComponent {
  locale: Locale
  scheduleWeekSlider: RefObject<SwiperRef | null>
  selectedWeekSlide: SelectedWeekSlide
  onPrevWeek: () => void
  onNextWeek: () => void
}

const goNext = (swiper: SwiperClass) => {
  swiper.slideNext()
}
const goPrev = (swiper: SwiperClass) => {
  swiper.slidePrev()
}

const ScheduleWeekVIewController = ({
  className,
  locale,
  scheduleWeekSlider,
  selectedWeekSlide,
  onPrevWeek,
  onNextWeek,
}: ScheduleWeekViewControllerProps) => {
  const [weekDays, setWeekDays] = useState<Date[]>(
    eachDayOfInterval({
      start: selectedWeekSlide.weekData.start,
      end: selectedWeekSlide.weekData.end,
    })
  )

  const [selectedDate, setSelectedDate] = useState(() => {
    if (isSameWeek(weekDays[0], startOfToday(), { weekStartsOn: 1 })) {
      return startOfToday()
    }
    return weekDays[0]
  })

  useEffect(() => {
    if (
      weekDays.length > 0 &&
      weekDays[selectedWeekSlide.activeDateIndex] !== undefined
    ) {
      setSelectedDate(weekDays[selectedWeekSlide.activeDateIndex])
    }
  }, [selectedWeekSlide.activeDateIndex, weekDays])

  useEffect(() => {
    setWeekDays(
      eachDayOfInterval({
        start: selectedWeekSlide.weekData.start,
        end: selectedWeekSlide.weekData.end,
      })
    )
  }, [selectedWeekSlide.index])

  const handleNext = () => {
    const scheduleSwiper = scheduleWeekSlider.current?.swiper
    if (scheduleSwiper !== undefined) {
      if (scheduleSwiper.activeIndex < 6) {
        goNext(scheduleSwiper)
        setSelectedDate(weekDays[scheduleSwiper.activeIndex])
      } else {
        onNextWeek()
      }
    }
  }

  const handlePrev = () => {
    const scheduleSwiper = scheduleWeekSlider.current?.swiper
    if (scheduleSwiper !== undefined) {
      if (scheduleSwiper?.activeIndex > 0) {
        goPrev(scheduleSwiper)
        setSelectedDate(weekDays[scheduleSwiper.activeIndex])
      } else {
        onPrevWeek()
      }
    }
  }

  const isDecrementActive = true

  const isIncrementActive = true

  return (
    <DayController
      className={className}
      day={selectedDate}
      locale={locale}
      isActive={isToday(selectedDate)}
      decrement={() => {
        if (isDecrementActive) {
          handlePrev()
        }
      }}
      increment={() => {
        if (isIncrementActive) {
          handleNext()
        }
      }}
      isDecrementActive={isDecrementActive}
      isIncrementActive={isIncrementActive}
    />
  )
}

export default ScheduleWeekVIewController
