import {
  Swiper,
  type SwiperProps,
  type SwiperRef,
  SwiperSlide,
} from "swiper/react"
import {
  eachDayOfInterval,
  isEqual,
  type Locale,
  startOfDay,
  startOfToday,
  startOfWeek,
} from "date-fns"
import ScheduleDayItem from "@shared/ui/ScheduleDayItem"
import type { ProfileType } from "@/domain/models/Profile.ts"
import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"
// @ts-ignore
import "swiper/css"
import { useCallback, useMemo, useRef, useState } from "react"
import DayController from "@shared/ui/DayController"
import "./WeekSlider.scss"

interface WeekSliderProps {
  profileType: ProfileType
  locale: Locale
  weekData: ScheduleWeekData
}

const WeekSlider = ({ weekData, profileType, locale }: WeekSliderProps) => {
  const swiperRef = useRef<SwiperRef | null>(null)
  const isCurrentWeek = useMemo(() => {
    return isEqual(
      startOfWeek(startOfToday(), { weekStartsOn: 1 }),
      weekData.start
    )
  }, [weekData])

  const weekDays = eachDayOfInterval({
    start: weekData.start,
    end: weekData.end,
  })

  const [activeindex, setActiveIndex] = useState<number>(() => {
    if (isCurrentWeek) {
      return weekDays.findIndex((day) => {
        return isEqual(startOfDay(day), startOfToday())
      })
    }
    return 0
  })

  const newWeekData = weekDays.map((day) => {
    const dayData = weekData.days.find((dayData) => isEqual(dayData.date, day))
    if (dayData !== undefined) {
      return dayData
    }
    return { date: day, lessons: [] }
  })

  const swiperParams: SwiperProps = useMemo(() => {
    return {
      grabCursor: true,
      spaceBetween: 60,
      centeredSlides: true,
      slidesPerView: "auto",
      roundLengths: true,
      speed: 500,
      autoHeight: true,
      style: {
        height: "100%",
        width: "100vw",
      },
      direction: "horizontal",
    }
  }, [])

  const goToIndex = useCallback((index: number) => {
    swiperRef.current?.swiper?.slideTo(index)
  }, [])

  const goNext = useCallback(
    () => swiperRef.current?.swiper?.slideNext(),
    [swiperRef]
  )
  const goPrev = useCallback(
    () => swiperRef.current?.swiper?.slidePrev(),
    [swiperRef]
  )

  return (
    <div
      className={"week-slider"}
      style={{ position: "relative" }}
    >
      <DayController
        day={weekDays[activeindex]}
        locale={locale}
        increment={goNext}
        decrement={goPrev}
        isActive={isEqual(startOfDay(weekDays[activeindex]), startOfToday())}
        isIncrementActive={activeindex < weekDays.length - 1}
        isDecrementActive={activeindex > 0}
      />
      <Swiper
        ref={swiperRef}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
        }}
        initialSlide={activeindex}
        {...swiperParams}
      >
        {newWeekData.map((date, index) => (
          <SwiperSlide
            key={date.date.toString()}
            style={{
              maxWidth: 510,
              scale: activeindex === index ? 1 : 0.8,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "100%",
              overflowY: "auto",
            }}
            onClick={() => {
              goToIndex(index)
            }}
          >
            <ScheduleDayItem
              className={"no-swiping-element"}
              dayData={date}
              profileType={profileType}
              locale={locale}
              isTitleIsHidden={index === activeindex}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="week-slider__bottom-drag-zone">
        <div className="week-slider__dragger"></div>
      </div>
    </div>
  )
}

export default WeekSlider
