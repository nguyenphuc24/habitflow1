import { useStore } from '../store/useStore'
import BottomSheet from './BottomSheet'
import dayjs from 'dayjs'

export default function StatsPage({ open, onClose }) {
  const { habits, logs, isCompleted, getStreak, getRate } = useStore()

  const totalDays = Object.keys(logs).length
  let bestStreak = 0
  habits.forEach(h => { const s = getStreak(h); if (s > bestStreak) bestStreak = s })

  let totalCompleted = 0
  Object.keys(logs).forEach(d => {
    habits.forEach(h => { if (isCompleted(h, d)) totalCompleted++ })
  })

  const rates = habits.map(h => getRate(h, 30))
  const avgRate = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0

  // Last 7 days bar chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(6 - i, 'day')
    const s = d.format('YYYY-MM-DD')
    const done = habits.filter(h => isCompleted(h, s)).length
    const total = habits.length
    return { label: d.format('dd'), pct: total ? Math.round((done / total) * 100) : 0 }
  })

  return (
    <BottomSheet open={open} onClose={onClose} tall>
      <h3 className="text-xl font-black mb-5">📊 Thống kê</h3>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { num: bestStreak, label: 'Streak tốt nhất', icon: '🔥', color: '#ff8c42' },
          { num: `${avgRate}%`, label: 'Tỉ lệ hoàn thành', icon: '🎯', color: '#22d3a0' },
          { num: totalCompleted, label: 'Tổng hoàn thành', icon: '✅', color: '#7c5cfc' },
          { num: totalDays, label: 'Ngày có dữ liệu', icon: '📅', color: '#c084fc' },
        ].map(({ num, label, icon, color }) => (
          <div key={label} className="bg-s2 rounded-2xl p-4 border border-bdr">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-[28px] font-black leading-none" style={{ color }}>{num}</div>
            <div className="text-[11px] text-t3 mt-1 font-medium uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* 7-day bar chart */}
      <div className="bg-s2 rounded-2xl p-4 border border-bdr mb-5">
        <div className="text-[12px] font-semibold text-t3 uppercase tracking-wider mb-4">7 ngày qua</div>
        <div className="flex items-end justify-between gap-2 h-[80px]">
          {last7.map(({ label, pct }) => (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full rounded-t-md relative" style={{ height: '64px', background: '#222230' }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-md transition-all duration-700"
                  style={{ height: `${pct}%`, background: 'linear-gradient(0deg,#7c5cfc,#c084fc)' }}
                />
              </div>
              <span className="text-[10px] text-t3 font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-habit */}
      <div className="bg-s2 rounded-2xl p-4 border border-bdr mb-4">
        <div className="text-[12px] font-semibold text-t3 uppercase tracking-wider mb-3">Từng habit (30 ngày)</div>
        {habits.length === 0 && <p className="text-t3 text-[13px]">Chưa có habit nào.</p>}
        {habits.map(h => {
          const rate = getRate(h, 30)
          const streak = getStreak(h)
          return (
            <div key={h.id} className="flex items-center gap-3 py-[10px] border-b border-bdr last:border-0">
              <span className="text-xl shrink-0">{h.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">{h.name}</div>
                <div className="mt-[5px] h-[4px] bg-s3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${rate}%`, background: h.color }} />
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[13px] font-black" style={{ color: h.color }}>{rate}%</span>
                {streak > 0 && <span className="text-[11px] text-org">🔥{streak}</span>}
              </div>
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
