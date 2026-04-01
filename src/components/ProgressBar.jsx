import { useStore } from '../store/useStore'

export default function ProgressBar() {
  const { habits, selectedDate, isCompleted } = useStore()
  const total = habits.length
  const done = habits.filter(h => isCompleted(h, selectedDate)).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="px-5 pb-3 shrink-0">
      <div className="flex justify-between items-center mb-[6px]">
        <span className="text-[13px] text-t2">{done} / {total} hoàn thành</span>
        <span className="text-[13px] font-black text-acc2">{pct}%</span>
      </div>
      <div className="h-[5px] bg-s3 rounded-full overflow-hidden">
        <div
          className="h-full gradient-acc rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
