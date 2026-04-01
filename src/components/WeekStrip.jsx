import { useStore } from '../store/useStore'
import { getWeekDays, todayStr } from '../utils/helpers'
import { useEffect, useRef } from 'react'

export default function WeekStrip() {
  const { selectedDate, setSelectedDate, logs } = useStore()
  const days = getWeekDays()
  const todayRef = useRef(null)

  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [])

  return (
    <div className="flex gap-[5px] px-5 pb-3 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
      {days.map(({ str, num, name }) => {
        const isToday = str === todayStr()
        const isSel = str === selectedDate
        const hasData = Object.keys(logs[str] || {}).length > 0
        return (
          <button
            key={str}
            ref={isToday ? todayRef : null}
            onClick={() => setSelectedDate(str)}
            className={[
              'flex flex-col items-center gap-[3px] py-2 px-[5px] min-w-[42px] rounded-[10px] shrink-0 border transition-all duration-200 press',
              isToday
                ? 'gradient-acc border-transparent text-white'
                : isSel
                  ? 'bg-s2 border-bdr text-t1'
                  : 'bg-transparent border-transparent text-t3 hover:bg-s2',
            ].join(' ')}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider">{name}</span>
            <span className="text-[19px] font-black leading-none">{num}</span>
            <span className={[
              'w-1 h-1 rounded-full transition-opacity',
              isToday ? 'bg-white/70' : 'bg-grn',
              hasData ? 'opacity-100' : 'opacity-0',
            ].join(' ')} />
          </button>
        )
      })}
    </div>
  )
}
