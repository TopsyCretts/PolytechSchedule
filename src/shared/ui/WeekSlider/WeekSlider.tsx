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
import ScheduleDayItem from "@/shared/ui/ScheduleDayItem"
import type { ProfileType } from "@/entities/Profile.ts"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
// @ts-ignore
import "swiper/css"
import {
  type RefObject,
  type UIEvent,
  useCallback,
  useMemo,
  useState,
} from "react"
import "./WeekSlider.scss"
import useMediaQueryListEvent from "@/shared/lib/useMediaQueryListEvent"
import { MATCH_MEDIA } from "@/shared/constants/media"

interface WeekSliderProps {
  profileType: ProfileType
  locale: Locale
  weekData: ScheduleWeekData
  initialDay?: number
  onSlideChange: (index: number) => void
  swiperRef: RefObject<SwiperRef | null>
  onScroll: (event: UIEvent) => void
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

  const swiperParams: SwiperProps = useMemo(() => {
    return {
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
  }, [])

  const goToIndex = useCallback(
    (index: number) => {
      swiperRef.current?.swiper.slideTo(index)
    },
    [swiperRef]
  )

  return (
    <Swiper
      ref={swiperRef}
      {...swiperParams}
      className={"week-slider"}
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.activeIndex)
        onSlideChange(swiper.activeIndex)
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
