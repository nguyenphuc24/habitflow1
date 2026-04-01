import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'

const COLORS = [
  '#7c5cfc','#c084fc','#22d3a0','#ff8c42',
  '#ff5566','#ffd166','#38bdf8','#f472b6',
  '#a3e635','#fb923c',
]
const ICONS = ['🧘','💪','📚','💧','🏃','😴','✍️','🎵','🍎','🌱','🧠','❤️','⚡','🎯','🔥','🌅','🏋️','🚿','🥗','☕']

export const COLORS_LIST = COLORS
export const ICONS_LIST = ICONS

function todayStr() { return dayjs().format('YYYY-MM-DD') }

const DEMO_HABITS = [
  { id:'demo1', name:'Thiền định',   group:'Buổi sáng', color:'#7c5cfc', icon:'🧘', goalType:'timer', goalValue:600,  createdAt: todayStr() },
  { id:'demo2', name:'Uống nước',    group:'Buổi sáng', color:'#38bdf8', icon:'💧', goalType:'count', goalValue:8,    createdAt: todayStr() },
  { id:'demo3', name:'Đọc sách',     group:'Buổi tối',  color:'#22d3a0', icon:'📚', goalType:'timer', goalValue:1800, createdAt: todayStr() },
  { id:'demo4', name:'Tập thể dục',  group:'Buổi sáng', color:'#ff8c42', icon:'💪', goalType:'check', goalValue:null, createdAt: todayStr() },
]

export const useStore = create(
  persist(
    (set, get) => ({
      habits: DEMO_HABITS,
      logs: {},          // { 'YYYY-MM-DD': { habitId: value } }
      selectedDate: todayStr(),

      /* ── DATE ── */
      setSelectedDate: (d) => set({ selectedDate: d }),

      /* ── HABITS ── */
      addHabit: (h) => set(s => ({ habits: [...s.habits, { ...h, id: Date.now().toString(), createdAt: todayStr() }] })),
      updateHabit: (id, updates) => set(s => ({ habits: s.habits.map(h => h.id === id ? { ...h, ...updates } : h) })),
      deleteHabit: (id) => set(s => ({ habits: s.habits.filter(h => h.id !== id) })),

      /* ── LOGS ── */
      getLog: (date, habitId) => (get().logs[date] || {})[habitId],
      setLog: (date, habitId, value) => set(s => ({
        logs: { ...s.logs, [date]: { ...(s.logs[date] || {}), [habitId]: value } }
      })),

      /* ── COMPUTED ── */
      isCompleted: (habit, date) => {
        const val = (get().logs[date] || {})[habit.id]
        if (habit.goalType === 'check') return val === true
        if (habit.goalType === 'count') return val !== undefined && val >= habit.goalValue
        if (habit.goalType === 'timer') return val !== undefined && val >= habit.goalValue
        return false
      },

      getStreak: (habit) => {
        const { logs } = get()
        let streak = 0
        let d = dayjs()
        while (true) {
          const s = d.format('YYYY-MM-DD')
          const val = (logs[s] || {})[habit.id]
          const done =
            habit.goalType === 'check' ? val === true :
            habit.goalType === 'count' ? val >= habit.goalValue :
            habit.goalType === 'timer' ? val >= habit.goalValue : false
          if (done) { streak++; d = d.subtract(1, 'day') }
          else break
        }
        return streak
      },

      getRate: (habit, days = 30) => {
        const { logs } = get()
        let done = 0
        for (let i = 0; i < days; i++) {
          const s = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
          const val = (logs[s] || {})[habit.id]
          const completed =
            habit.goalType === 'check' ? val === true :
            habit.goalType === 'count' ? val >= habit.goalValue :
            habit.goalType === 'timer' ? val >= habit.goalValue : false
          if (completed) done++
        }
        return Math.round((done / days) * 100)
      },
    }),
    { name: 'habitflow-v1' }
  )
)
