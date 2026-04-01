import { useState, useRef } from 'react'
import { useStore } from '../store/useStore'
import { vibrate } from '../utils/helpers'

export default function HabitCard({ habit, onEdit, onOpenTimer, onOpenCount }) {
  const { selectedDate, isCompleted, getLog, setLog, getStreak, deleteHabit } = useStore()
  const done = isCompleted(habit, selectedDate)
  const streak = getStreak(habit)
  const log = getLog(selectedDate, habit.id)
  const [showCtx, setShowCtx] = useState(false)
  const pressTimer = useRef(null)

  const subText = () => {
    if (habit.goalType === 'count') return `${log || 0} / ${habit.goalValue} lần`
    if (habit.goalType === 'timer') return `${Math.floor((log || 0) / 60)} / ${Math.floor(habit.goalValue / 60)} phút`
    return 'Hằng ngày'
  }

  const handleAction = () => {
    if (habit.goalType === 'check') {
      setLog(selectedDate, habit.id, done ? undefined : true)
      if (!done) vibrate()
    } else if (habit.goalType === 'count') {
      onOpenCount(habit)
    } else if (habit.goalType === 'timer') {
      onOpenTimer(habit)
    }
  }

  const actionIcon = () => {
    if (done) return '✓'
    if (habit.goalType === 'count') return '＋'
    if (habit.goalType === 'timer') return '⏱'
    return '○'
  }

  return (
    <div
      className="relative rounded-2xl mb-[10px] flex items-center gap-[14px] px-4 py-[13px] border transition-all duration-200 select-none"
      style={{
        background: `color-mix(in srgb, ${habit.color} 12%, #18181f)`,
        borderColor: `color-mix(in srgb, ${habit.color} 28%, transparent)`,
        opacity: done ? 0.72 : 1,
      }}
      onPointerDown={() => { pressTimer.current = setTimeout(() => setShowCtx(true), 500) }}
      onPointerUp={() => clearTimeout(pressTimer.current)}
      onPointerCancel={() => clearTimeout(pressTimer.current)}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-[14px] flex items-center justify-center text-2xl shrink-0"
        style={{ background: `color-mix(in srgb, ${habit.color} 22%, transparent)` }}
      >
        {habit.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] truncate text-t1">{habit.name}</div>
        <div className="text-[12px] text-t2 mt-[2px]">
          {subText()}
          {streak > 0 && <span className="text-org ml-2">🔥 {streak}</span>}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={handleAction}
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-none outline-none press transition-all duration-200"
        style={done
          ? { background: habit.color, boxShadow: `0 4px 16px color-mix(in srgb, ${habit.color} 50%, transparent)`, color: '#fff' }
          : { background: `color-mix(in srgb, ${habit.color} 18%, transparent)`, color: '#fff' }
        }
      >
        {actionIcon()}
      </button>

      {/* Context menu */}
      {showCtx && (
        <div
          className="absolute right-3 top-3 z-10 bg-s3 border border-bdr rounded-xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-[13px] px-4 py-[10px] cursor-pointer hover:bg-s2 text-t1 whitespace-nowrap"
            onClick={() => { setShowCtx(false); onEdit(habit) }}>✏️ Chỉnh sửa</div>
          <div className="text-[13px] px-4 py-[10px] cursor-pointer hover:bg-s2 text-danger whitespace-nowrap"
            onClick={() => { setShowCtx(false); if (confirm('Xoá habit này?')) deleteHabit(habit.id) }}>🗑 Xoá</div>
        </div>
      )}
      {showCtx && (
        <div className="fixed inset-0 z-[9]" onClick={() => setShowCtx(false)} />
      )}
    </div>
  )
}
