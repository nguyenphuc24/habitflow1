import { useState, useEffect, useRef } from 'react'
import BottomSheet from './BottomSheet'
import { useStore } from '../store/useStore'
import { formatTime, vibrate } from '../utils/helpers'

const CIRC = 553

export default function TimerModal({ open, onClose, habit }) {
  const { selectedDate, setLog, getLog } = useStore()
  const goalSecs = habit?.goalValue || 600
  const [secs, setSecs] = useState(goalSecs)
  const [running, setRunning] = useState(false)
  const [manualMinutes, setManualMinutes] = useState('')
  const intervalRef = useRef(null)

  // Reset khi mở modal
  useEffect(() => {
    if (open && habit) {
      const existing = getLog(selectedDate, habit.id) || 0
      setSecs(goalSecs)
      setRunning(false)
      setManualMinutes(existing > 0 ? String(Math.floor(existing / 60)) : '')
      clearInterval(intervalRef.current)
    }
  }, [open, habit])

  // Dừng interval khi unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
  }

  const toggle = () => {
    if (running) {
      stopTimer()
    } else {
      setRunning(true)
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setRunning(false)
            vibrate(100)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
  }

  // Đóng modal mà KHÔNG lưu, dừng timer
  const handleClose = () => {
    stopTimer()
    onClose()
  }

  // Lưu khi nhấn "Xong" — ưu tiên timer, fallback manual input
  const handleDone = () => {
    stopTimer()
    const elapsed = goalSecs - secs

    if (elapsed > 0) {
      // Đã dùng timer → lưu thời gian đã đếm
      setLog(selectedDate, habit.id, elapsed)
    } else if (manualMinutes && parseInt(manualMinutes) > 0) {
      // Không dùng timer → lưu số phút nhập tay (đổi sang giây)
      setLog(selectedDate, habit.id, parseInt(manualMinutes) * 60)
    }
    onClose()
  }

  const elapsed = goalSecs - secs
  const displaySecs = running ? secs : goalSecs
  const arcOffset = CIRC * (running ? secs / goalSecs : 1)
  const pct = elapsed > 0 ? Math.min(100, Math.round((elapsed / goalSecs) * 100)) : 0

  return (
    <BottomSheet open={open} onClose={handleClose}>
      <h3 className="text-xl font-black text-center mb-1">{habit?.icon} {habit?.name}</h3>
      <p className="text-t3 text-center text-[13px] mb-4">Mục tiêu: {Math.floor(goalSecs / 60)} phút</p>

      {/* Ring */}
      <div className="relative w-[200px] mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-[200px] h-[200px] -rotate-90">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#222230" strokeWidth="12" />
          <circle cx="100" cy="100" r="88" fill="none"
            stroke={habit?.color || '#7c5cfc'} strokeWidth="12"
            strokeLinecap="round" strokeDasharray={CIRC}
            strokeDashoffset={CIRC - arcOffset}
            style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[42px] font-black leading-none">{formatTime(displaySecs)}</span>
          <span className="text-t3 text-[13px] mt-1">{running ? `${pct}%` : 'Sẵn sàng'}</span>
        </div>
      </div>

      {/* +/- chỉ hoạt động khi chưa chạy */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => !running && setSecs(s => Math.max(60, s - 300))}
          className={`w-11 h-11 rounded-full bg-s2 border border-bdr text-t1 text-xl flex items-center justify-center press ${running ? 'opacity-30' : ''}`}
        >－</button>
        <button onClick={toggle}
          className="px-8 py-3 rounded-xl gradient-acc text-white font-bold text-[15px] press">
          {running ? '⏸ Tạm dừng' : secs < goalSecs ? '▶ Tiếp tục' : '▶ Bắt đầu'}
        </button>
        <button
          onClick={() => !running && setSecs(s => s + 300)}
          className={`w-11 h-11 rounded-full bg-s2 border border-bdr text-t1 text-xl flex items-center justify-center press ${running ? 'opacity-30' : ''}`}
        >＋</button>
      </div>

      {/* Nhập tay nếu không dùng timer */}
      {!running && elapsed === 0 && (
        <div className="mb-4">
          <p className="text-t3 text-[12px] text-center mb-2">Hoặc nhập số phút đã học</p>
          <div className="flex items-center gap-3 bg-s2 border border-bdr rounded-xl px-4 py-2">
            <input
              type="number" min="1" max="999"
              placeholder="0"
              value={manualMinutes}
              onChange={e => setManualMinutes(e.target.value)}
              className="flex-1 bg-transparent text-t1 text-[20px] font-bold outline-none text-center"
            />
            <span className="text-t3 text-[14px]">phút</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleClose}
          className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-t2 font-semibold press">
          Huỷ
        </button>
        <button onClick={handleDone}
          className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-grn font-bold press">
          ✓ Xong
        </button>
      </div>
    </BottomSheet>
  )
}
