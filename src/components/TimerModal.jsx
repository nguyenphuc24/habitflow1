import { useState, useEffect, useRef } from 'react'
import BottomSheet from './BottomSheet'
import { useStore } from '../store/useStore'
import { formatTime, vibrate } from '../utils/helpers'

const CIRC = 553

export default function TimerModal({ open, onClose, habit }) {
  const { selectedDate, setLog, getLog } = useStore()
  const [secs, setSecs] = useState(600)
  const [running, setRunning] = useState(false)
  const goalSecs = habit?.goalValue || 600
  const intervalRef = useRef(null)

  useEffect(() => {
    if (open && habit) {
      setSecs(goalSecs)
      setRunning(false)
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [open, habit])

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      setRunning(true)
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            vibrate(100)
            setLog(selectedDate, habit.id, goalSecs)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
  }

  const done = () => {
    clearInterval(intervalRef.current)
    const elapsed = goalSecs - secs
    if (elapsed > 0) setLog(selectedDate, habit.id, Math.max(elapsed, goalSecs))
    onClose()
  }

  const offset = CIRC * (secs / goalSecs)
  const pct = Math.round(((goalSecs - secs) / goalSecs) * 100)

  return (
    <BottomSheet open={open} onClose={() => { clearInterval(intervalRef.current); onClose() }}>
      <h3 className="text-xl font-black text-center mb-2">{habit?.icon} {habit?.name}</h3>
      <p className="text-t3 text-center text-[13px] mb-4">Mục tiêu: {Math.floor(goalSecs / 60)} phút</p>

      {/* Ring */}
      <div className="relative w-[200px] mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-[200px] h-[200px] -rotate-90">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#222230" strokeWidth="12" />
          <circle cx="100" cy="100" r="88" fill="none"
            stroke={habit?.color || '#7c5cfc'} strokeWidth="12"
            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC - offset}
            style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[42px] font-black leading-none">{formatTime(secs)}</span>
          <span className="text-t3 text-[13px] mt-1">{pct}%</span>
        </div>
      </div>

      {/* +/- */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button onClick={() => !running && setSecs(s => Math.max(60, s - 300))}
          className="w-11 h-11 rounded-full bg-s2 border border-bdr text-t1 text-xl flex items-center justify-center press">－</button>
        <button onClick={toggle}
          className="px-8 py-3 rounded-xl gradient-acc text-white font-bold text-[15px] press">
          {running ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
        </button>
        <button onClick={() => !running && setSecs(s => s + 300)}
          className="w-11 h-11 rounded-full bg-s2 border border-bdr text-t1 text-xl flex items-center justify-center press">＋</button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => { clearInterval(intervalRef.current); onClose() }}
          className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-t2 font-semibold press">Huỷ</button>
        <button onClick={done}
          className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-grn font-bold press">✓ Xong</button>
      </div>
    </BottomSheet>
  )
}
