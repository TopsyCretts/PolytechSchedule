import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { WeekSlider } from "@shared/ui"
import { useTranslation } from "react-i18next"
import { LANGUAGES_MAP } from "@/constants/contstants.ts"
import { useCallback, useRef, useState } from "react"
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react"
import ScheduleWeekSelect from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelect.tsx"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"
import { startOfToday } from "date-fns"
import { findWeekSlide } from "@/pages/schedule-week-slider/lib/findWeekSlide.ts"

const ScheduleWeekSlider = () => {
  const { data, profileType } = useScheduleData()
  const { i18n } = useTranslation()

  if (data.weeks.length === 0) {
    throw new Error("HANDLE EMPTY WEEKS")
  }

  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeindex, setActiveIndex] = useState<SelectedWeekSlide>(
    findWeekSlide(data.weeks, startOfToday())
  )

  const goToIndex = useCallback((index: number) => {
    swiperRef.current?.swiper?.slideTo(index)
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
      <div
        style={{
          height: 800,
        }}
      >
        <Swiper
          ref={swiperRef}
          onSlideChange={({ activeIndex }) => {
            setActiveIndex({
              index: activeIndex,
              startDate: data.weeks[activeIndex].start,
            })
          }}
          grabCursor={true}
          initialSlide={activeindex.index}
          spaceBetween={0}
          centeredSlides={true}
          roundLengths={true}
          allowTouchMove={true}
          slidesPerView={1}
          longSwipesRatio={0.2}
          longSwipesMs={100}
          speed={1000}
          simulateTouch={true}
          style={{
            width: "100%",
            maxWidth: "100%",
            marginBottom: 0,
            height: "100%",
            zIndex: 0,
          }}
          noSwipingClass={"no-swiping-element"}
          noSwipingSelector={".no-swiping-element"}
          noSwiping={true}
          direction={"vertical"}
        >
          {data.weeks.map((week, index) => (
            <SwiperSlide
              key={week.start.toString()}
              onClick={() => {
                goToIndex(index)
              }}
              style={{
                height: "100%",
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
      </div>
    </>
  )
}

export default ScheduleWeekSlider
