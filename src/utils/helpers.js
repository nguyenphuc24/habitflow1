import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')

export function todayStr() { return dayjs().format('YYYY-MM-DD') }

export function formatHeaderDate(str) {
  if (str === todayStr()) return 'Hôm nay'
  return dayjs(str).format('ddd, D MMM')
}

export function getWeekDays() {
  const days = []
  for (let i = -3; i <= 3; i++) {
    const d = dayjs().add(i, 'day')
    days.push({ str: d.format('YYYY-MM-DD'), num: d.date(), name: d.format('dd').toUpperCase() })
  }
  return days
}

export function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function vibrate(ms = 25) {
  try { navigator.vibrate?.(ms) } catch {}
}

export function groupHabits(habits) {
  return habits.reduce((acc, h) => {
    const g = h.group || 'Habits'
    if (!acc[g]) acc[g] = []
    acc[g].push(h)
    return acc
  }, {})
}
