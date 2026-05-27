import {
  Swiper,
  type SwiperProps,
  type SwiperRef,
  SwiperSlide,
} from "swiper/react"
import {
  eachDayOfInterval,
  getDay,
  isEqual,
  type Locale,
  startOfToday,
} from "date-fns"
import ScheduleDayItem from "@/entities/schedule/ui/ScheduleDayItem"
import type { ProfileType } from "@/entities/profile/model/Profile.ts"
import type { ScheduleWeekData } from "@/shared/api/entities/ScheduleData.ts"
// @ts-ignore
import "swiper/css"
import { type RefObject, type UIEvent, useCallback, useState } from "react"
import "./WeekSlider.scss"
import useMediaQueryListEvent from "@/shared/hooks/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"

interface WeekSliderProps {
  profileType: ProfileType
  locale: Locale
  weekData: ScheduleWeekData
  initialDay?: number
  onSlideChange: (index: number, day: Date) => void
  swiperRef: RefObject<SwiperRef | null>
  onScroll: (event: UIEvent) => void
}

const STATIC_SWIPER_PROPS: SwiperProps = {
  grabCursor: true,
  spaceBetween: 0,
  centeredSlides: true,
  slidesPerView: "auto",
  roundLengths: true,
  speed: 500,
  style: {
    width: "100vw",
  },
  direction: "horizontal",
}

const WeekSlider = ({
  weekData,
  profileType,
  locale,
  swiperRef,
  onSlideChange,
  onScroll,
  initialDay = getDay(startOfToday()),
}: WeekSliderProps) => {
  const weekDays = eachDayOfInterval({
    start: weekData.start,
    end: weekData.end,
  })

  const { isMatchesMedia } = useMediaQueryListEvent(MATCH_MEDIA.mobile_s)

  const [activeindex, setActiveIndex] = useState<number>(initialDay)

  const newWeekData = weekDays.map((day) => {
    const dayData = weekData.days.find((dayData) => isEqual(dayData.date, day))
    if (dayData !== undefined) {
      return dayData
    }
    return { date: day, lessons: [] }
  })

  const goToIndex = useCallback(
    (index: number) => {
      swiperRef.current?.swiper.slideTo(index)
    },
    [swiperRef]
  )

  const handleSlideChange = (newActiveIndex: number) => {
    setActiveIndex(newActiveIndex)
    const newDay: Date = weekDays[newActiveIndex]
    if (newDay) {
      onSlideChange(newActiveIndex, newDay)
    }
  }

  return (
    <Swiper
      ref={swiperRef}
      {...STATIC_SWIPER_PROPS}
      className={"week-slider"}
      onSlideChange={({ activeIndex }) => {
        handleSlideChange(activeIndex)
      }}
      initialSlide={activeindex}
      touchMoveStopPropagation={true}
    >
      {newWeekData.map((date, index) => (
        <SwiperSlide
          key={date.date.toString()}
          id={"week-day-" + index}
          className={"week-slider__slide"}
          style={{
            scale: activeindex === index ? 1 : 0.92,
            overflowY: activeindex === index ? "auto" : "hidden",
          }}
          onScroll={(event) => onScroll(event)}
          onClick={() => {
            goToIndex(index)
          }}
        >
          <ScheduleDayItem
            className={"week-slider__day-item"}
            dayData={date}
            profileType={profileType}
            locale={locale}
            isTitleIsHidden={index === activeindex || isMatchesMedia}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default WeekSlider
