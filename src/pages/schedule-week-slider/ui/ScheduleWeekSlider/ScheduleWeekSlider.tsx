import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { WeekSlider } from "@shared/ui"
import { useTranslation } from "react-i18next"
import { LANGUAGES_MAP } from "@/constants/contstants.ts"
import { useCallback, useMemo, useRef, useState } from "react"
import {
  Swiper,
  type SwiperProps,
  type SwiperRef,
  SwiperSlide,
} from "swiper/react"
import ScheduleWeekSelect from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelect.tsx"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"

const ScheduleWeekSlider = () => {
  const { data, profileType } = useScheduleData()
  const { i18n } = useTranslation()

  if (data.weeks.length === 0) {
    throw new Error("HANDLE EMPTY WEEKS")
  }

  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeindex, setActiveIndex] = useState<SelectedWeekSlide>({
    index: 0,
    startDate: data.weeks[0].start,
  })

  const goToIndex = useCallback((index: number) => {
    swiperRef.current?.swiper?.slideTo(index)
  }, [])

  const swiperParams: SwiperProps = useMemo(() => {
    return {
      grabCursor: true,
      spaceBetween: 60,
      centeredSlides: true,
      roundLengths: true,
      speed: 1000,
      slidesPerView: "auto",
      style: {
        overflowY: "hidden",
        height: 777,
        maxWidth: "100%",
      },
      direction: "vertical",
    }
  }, [])

  const handleWeekSelection = (weekData: ScheduleWeekData) => {
    const newActiveIndex = data.weeks.indexOf(weekData)
    if (newActiveIndex !== -1) {
      setActiveIndex({ index: newActiveIndex, startDate: weekData.start })
      goToIndex(newActiveIndex)
    }
  }

  return (
    <>
      <ScheduleWeekSelect
        weekData={data.weeks}
        startWeekFormat={"dd-MM-yyyy"}
        locale={LANGUAGES_MAP[i18n.language].locale}
        selectedWeekStart={activeindex.startDate}
        onSelectedWeekChange={handleWeekSelection}
      />
      <Swiper
        ref={swiperRef}
        onSlideChange={({ activeIndex }) => {
          setActiveIndex({
            index: activeIndex,
            startDate: data.weeks[activeIndex].start,
          })
        }}
        {...swiperParams}
      >
        {data.weeks.map((week, index) => (
          <SwiperSlide
            key={week.start.toString()}
            onClick={() => {
              goToIndex(index)
            }}
          >
            <WeekSlider
              key={week.start.toString()}
              weekData={week}
              locale={LANGUAGES_MAP[i18n.language].locale}
              profileType={profileType}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default ScheduleWeekSlider
