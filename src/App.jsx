import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import { formatHeaderDate, groupHabits } from './utils/helpers'
import WeekStrip from './components/WeekStrip'
import ProgressBar from './components/ProgressBar'
import HabitCard from './components/HabitCard'
import HabitModal from './components/HabitModal'
import TimerModal from './components/TimerModal'
import CountModal from './components/CountModal'
import StatsPage from './components/StatsPage'
import AchievementsPage from './components/AchievementsPage'

export default function App() {
  const { habits, selectedDate } = useStore()
  const [splash, setSplash] = useState(true)
  const [splashOut, setSplashOut] = useState(false)

  // modals
  const [habitModalOpen, setHabitModalOpen] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [timerHabit, setTimerHabit] = useState(null)
  const [countHabit, setCountHabit] = useState(null)
  const [statsOpen, setStatsOpen] = useState(false)
  const [achieveOpen, setAchieveOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('today')

  useEffect(() => {
    setTimeout(() => setSplashOut(true), 1200)
    setTimeout(() => setSplash(false), 1700)
  }, [])

  const openEdit = (h) => { setEditHabit(h); setHabitModalOpen(true) }
  const openAdd = () => { setEditHabit(null); setHabitModalOpen(true) }
  const grouped = groupHabits(habits)

  return (
    <>
      {/* ── SPLASH ── */}
      {splash && (
        <div className={`fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center gap-4 transition-all duration-500 ${splashOut ? 'opacity-0 scale-105' : 'opacity-100'}`}>
          <div className="w-20 h-20 rounded-full gradient-acc flex items-center justify-center text-4xl shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(124,92,252,.6)', animation: 'pulse 1.8s ease-in-out infinite' }}>
            ⚡
          </div>
          <div className="text-[32px] font-black gradient-text">HabitFlow</div>
          <div className="text-t3 text-[13px] tracking-wider">Build momentum, daily.</div>
          <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}`}</style>
        </div>
      )}

      {/* ── APP ── */}
      <div className={`flex flex-col h-dvh max-mobile bg-bg transition-opacity duration-500 ${splash ? 'opacity-0' : 'opacity-100'}`}>

        {/* Header */}
        <header className="flex items-end justify-between px-5 pb-2 shrink-0"
          style={{ paddingTop: 'calc(env(safe-area-inset-top,14px) + 14px)' }}>
          <div>
            <div className="text-[24px] font-black gradient-text">HabitFlow</div>
            <div className="text-[13px] text-t3 mt-[1px]">{formatHeaderDate(selectedDate)}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStatsOpen(true)}
              className="w-[38px] h-[38px] rounded-full bg-s2 border border-bdr text-[17px] flex items-center justify-center press">
              📊
            </button>
            <button onClick={openAdd}
              className="w-[38px] h-[38px] rounded-full gradient-acc text-white text-[22px] flex items-center justify-center press font-light card-glow">
              +
            </button>
          </div>
        </header>

        <WeekStrip />
        <ProgressBar />

        {/* Habits list */}
        <main className="flex-1 overflow-y-auto px-4 pb-[100px]">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
              <div className="text-[56px]">🌱</div>
              <p className="text-t3 text-center text-[15px] leading-relaxed">
                Chưa có habit nào.<br />
                Nhấn <strong className="text-acc2">+</strong> để bắt đầu!
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, gHabits]) => (
              <div key={group}>
                <div className="flex items-center gap-3 my-4 mx-1">
                  <span className="text-[11px] font-semibold text-t3 uppercase tracking-wider">{group}</span>
                  <div className="flex-1 h-px bg-bdr" />
                </div>
                {gHabits.map(h => (
                  <HabitCard
                    key={h.id} habit={h}
                    onEdit={openEdit}
                    onOpenTimer={setTimerHabit}
                    onOpenCount={setCountHabit}
                  />
                ))}
              </div>
            ))
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 max-mobile mx-auto bg-s1 border-t border-bdr flex justify-around items-center"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 10px)', paddingTop: '10px' }}>
          {[
            { id: 'today', icon: '🏠', label: 'Hôm nay', onClick: () => setActiveTab('today') },
            { id: 'stats', icon: '📊', label: 'Thống kê', onClick: () => { setActiveTab('stats'); setStatsOpen(true) } },
            { id: 'achieve', icon: '🏆', label: 'Thành tích', onClick: () => { setActiveTab('achieve'); setAchieveOpen(true) } },
          ].map(t => (
            <button key={t.id} onClick={t.onClick}
              className={`flex flex-col items-center gap-[3px] px-6 rounded-xl transition-colors ${activeTab === t.id ? 'text-acc2' : 'text-t3'}`}>
              <span className="text-[22px]">{t.icon}</span>
              <span className="text-[11px] font-semibold">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── MODALS ── */}
      <HabitModal
        open={habitModalOpen}
        onClose={() => { setHabitModalOpen(false); setEditHabit(null) }}
        editHabit={editHabit}
      />
      <TimerModal
        open={!!timerHabit}
        onClose={() => setTimerHabit(null)}
        habit={timerHabit}
      />
      <CountModal
        open={!!countHabit}
        onClose={() => setCountHabit(null)}
        habit={countHabit}
      />
      <StatsPage
        open={statsOpen}
        onClose={() => { setStatsOpen(false); setActiveTab('today') }}
      />
      <AchievementsPage
        open={achieveOpen}
        onClose={() => { setAchieveOpen(false); setActiveTab('today') }}
      />
    </>
  )
}
