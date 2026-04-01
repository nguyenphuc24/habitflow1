import { useStore } from '../store/useStore'
import BottomSheet from './BottomSheet'

const STREAK_BADGES = [
  { days: 2,   icon: '🔥', label: '2 ngày' },
  { days: 5,   icon: '🔥', label: '5 ngày' },
  { days: 7,   icon: '🏅', label: '1 tuần' },
  { days: 14,  icon: '🥈', label: '2 tuần' },
  { days: 30,  icon: '🥇', label: '1 tháng' },
  { days: 60,  icon: '💎', label: '2 tháng' },
  { days: 90,  icon: '👑', label: '3 tháng' },
  { days: 180, icon: '⚡', label: '6 tháng' },
  { days: 365, icon: '🌟', label: '1 năm' },
]

const TOTAL_BADGES = [
  { need: 1,   icon: '🌱', label: '1 lần' },
  { need: 10,  icon: '🌿', label: '10 lần' },
  { need: 25,  icon: '🌳', label: '25 lần' },
  { need: 50,  icon: '🎖', label: '50 lần' },
  { need: 100, icon: '🏆', label: '100 lần' },
  { need: 250, icon: '💫', label: '250 lần' },
]

export default function AchievementsPage({ open, onClose }) {
  const { habits, logs, isCompleted, getStreak } = useStore()

  const maxStreak = habits.reduce((m, h) => Math.max(m, getStreak(h)), 0)

  let totalCompleted = 0
  Object.keys(logs).forEach(d => {
    habits.forEach(h => { if (isCompleted(h, d)) totalCompleted++ })
  })

  const unlockedCount = [
    ...STREAK_BADGES.filter(b => maxStreak >= b.days),
    ...TOTAL_BADGES.filter(b => totalCompleted >= b.need),
  ].length

  return (
    <BottomSheet open={open} onClose={onClose} tall>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-black">🏆 Thành tích</h3>
        <span className="text-[13px] text-acc2 font-bold">{unlockedCount} / {STREAK_BADGES.length + TOTAL_BADGES.length}</span>
      </div>
      <p className="text-t3 text-[13px] mb-5">Hoàn thành thử thách để mở khoá huy hiệu</p>

      {/* Streak badges */}
      <div className="text-[11px] font-semibold text-t3 uppercase tracking-wider mb-3">🔥 Streak dài nhất</div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {STREAK_BADGES.map(b => {
          const unlocked = maxStreak >= b.days
          return (
            <div key={b.days}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${unlocked ? 'bg-s2 border-bdr' : 'bg-s1 border-s2 opacity-35'}`}>
              <span className="text-[32px]">{unlocked ? b.icon : '🔒'}</span>
              <span className="text-[11px] text-t2 font-semibold text-center">{b.label}</span>
              {unlocked && <span className="text-[10px] text-grn font-bold">Đạt được!</span>}
            </div>
          )
        })}
      </div>

      {/* Total badges */}
      <div className="text-[11px] font-semibold text-t3 uppercase tracking-wider mb-3">🎯 Tổng hoàn thành</div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {TOTAL_BADGES.map(b => {
          const unlocked = totalCompleted >= b.need
          return (
            <div key={b.need}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${unlocked ? 'bg-s2 border-bdr' : 'bg-s1 border-s2 opacity-35'}`}>
              <span className="text-[32px]">{unlocked ? b.icon : '🔒'}</span>
              <span className="text-[11px] text-t2 font-semibold text-center">{b.label}</span>
              {unlocked && <span className="text-[10px] text-grn font-bold">Đạt được!</span>}
            </div>
          )
        })}
      </div>

      <button onClick={onClose} className="w-full py-[14px] rounded-xl bg-s2 border border-bdr text-t2 font-semibold press">
        Đóng
      </button>
    </BottomSheet>
  )
}
