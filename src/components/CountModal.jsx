import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { useStore } from '../store/useStore'
import { vibrate } from '../utils/helpers'

export default function CountModal({ open, onClose, habit }) {
  const { selectedDate, getLog, setLog } = useStore()
  const [cur, setCur] = useState(0)

  useEffect(() => {
    if (open && habit) setCur(getLog(selectedDate, habit.id) || 0)
  }, [open, habit])

  const inc = () => { setCur(c => c + 1); vibrate() }
  const dec = () => setCur(c => Math.max(0, c - 1))
  const save = () => { setLog(selectedDate, habit.id, cur); onClose() }

  const goal = habit?.goalValue || 1
  const pct = Math.min(100, Math.round((cur / goal) * 100))

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h3 className="text-xl font-black text-center mb-1">{habit?.icon} {habit?.name}</h3>
      <p className="text-t3 text-center text-[13px] mb-6">Mục tiêu: {goal} lần</p>

      {/* Progress ring */}
      <div className="relative w-[160px] mx-auto mb-6">
        <svg viewBox="0 0 160 160" className="w-[160px] h-[160px] -rotate-90">
          <circle cx="80" cy="80" r="68" fill="none" stroke="#222230" strokeWidth="10" />
          <circle cx="80" cy="80" r="68" fill="none"
            stroke={habit?.color || '#7c5cfc'} strokeWidth="10"
            strokeLinecap="round" strokeDasharray="427"
            strokeDashoffset={427 - (427 * pct / 100)}
            style={{ transition: 'stroke-dashoffset .3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[48px] font-black leading-none" style={{ color: habit?.color }}>{cur}</span>
          <span className="text-t3 text-[12px]">/ {goal}</span>
        </div>
      </div>

      {/* +/- */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button onClick={dec}
          className="w-16 h-16 rounded-full bg-s2 border border-bdr text-t1 text-3xl flex items-center justify-center press">－</button>
        <button onClick={inc}
          className="w-16 h-16 rounded-full gradient-acc text-white text-3xl flex items-center justify-center press shadow-lg">＋</button>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-t2 font-semibold press">Huỷ</button>
        <button onClick={save} className="flex-1 py-[14px] rounded-xl gradient-acc text-white font-bold press">Lưu</button>
      </div>
    </BottomSheet>
  )
}
