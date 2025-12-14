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
import useMediaQueryListEvent from "@shared/lib/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"

interface WeekSliderProps {
  profileType: ProfileType
  locale: Locale
  weekData: ScheduleWeekData
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
}: WeekSliderProps) => {
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

  const { isMatchesMedia } = useMediaQueryListEvent(MATCH_MEDIA.mobile_s)

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
      className={"week-slider"}
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.activeIndex)
        onSlideChange(swiper.activeIndex)
      }}
      initialSlide={activeindex}
      touchMoveStopPropagation={true}
      {...swiperParams}
    >
      {newWeekData.map((date, index) => (
        <SwiperSlide
          key={date.date.toString()}
          id={"week-day-" + index}
          className={"week-slider__slide"}
          style={{ scale: activeindex === index ? 1 : 0.8 }}
          onScroll={(event) => onScroll(event)}
          onClick={() => {
            goToIndex(index)
          }}
        >
          <ScheduleDayItem
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
