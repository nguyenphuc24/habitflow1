import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { useStore, COLORS_LIST, ICONS_LIST } from '../store/useStore'

const SEG = [
  { key: 'check', label: '✓ Check-in' },
  { key: 'count', label: '🔢 Số lần' },
  { key: 'timer', label: '⏱ Thời gian' },
]

export default function HabitModal({ open, onClose, editHabit = null }) {
  const { addHabit, updateHabit } = useStore()
  const [name, setName] = useState('')
  const [group, setGroup] = useState('')
  const [color, setColor] = useState(COLORS_LIST[0])
  const [icon, setIcon] = useState(ICONS_LIST[0])
  const [goalType, setGoalType] = useState('check')
  const [goalValue, setGoalValue] = useState('')

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name); setGroup(editHabit.group || '')
      setColor(editHabit.color); setIcon(editHabit.icon)
      setGoalType(editHabit.goalType)
      setGoalValue(editHabit.goalType === 'timer' ? String(Math.floor(editHabit.goalValue / 60)) : String(editHabit.goalValue || ''))
    } else {
      setName(''); setGroup(''); setColor(COLORS_LIST[0]); setIcon(ICONS_LIST[0])
      setGoalType('check'); setGoalValue('')
    }
  }, [editHabit, open])

  const save = () => {
    if (!name.trim()) return
    let gv = null
    if (goalType !== 'check') {
      gv = parseInt(goalValue)
      if (!gv || gv < 1) return
      if (goalType === 'timer') gv *= 60
    }
    const data = { name: name.trim(), group: group.trim(), color, icon, goalType, goalValue: gv }
    if (editHabit) updateHabit(editHabit.id, data)
    else addHabit(data)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h3 className="text-xl font-black mb-5">{editHabit ? 'Chỉnh sửa Habit' : 'Tạo Habit Mới'}</h3>

      {/* Preview */}
      <div className="rounded-2xl flex items-center gap-3 px-4 py-3 mb-5 border"
        style={{ background: `color-mix(in srgb,${color} 14%,#18181f)`, borderColor: `color-mix(in srgb,${color} 30%,transparent)` }}>
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-semibold text-[15px]">{name || 'Tên habit'}</div>
          <div className="text-[12px] text-t2">{group || 'Nhóm'}</div>
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">Tên habit</label>
        <input
          className="w-full bg-s2 border border-bdr rounded-xl px-4 py-3 text-[15px] text-t1 outline-none focus:border-acc placeholder:text-t3"
          value={name} onChange={e => setName(e.target.value)} placeholder="VD: Thiền định, Đọc sách..." maxLength={40}
        />
      </div>

      {/* Group */}
      <div className="mb-4">
        <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">Nhóm</label>
        <input
          className="w-full bg-s2 border border-bdr rounded-xl px-4 py-3 text-[15px] text-t1 outline-none focus:border-acc placeholder:text-t3"
          value={group} onChange={e => setGroup(e.target.value)} placeholder="VD: Buổi sáng, Sức khoẻ..." maxLength={20}
        />
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">Màu sắc</label>
        <div className="flex gap-[10px] flex-wrap">
          {COLORS_LIST.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-[3px] transition-transform press"
              style={{ background: c, borderColor: c === color ? '#fff' : 'transparent', transform: c === color ? 'scale(1.15)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>

      {/* Icon */}
      <div className="mb-4">
        <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">Icon</label>
        <div className="flex gap-2 flex-wrap">
          {ICONS_LIST.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              className="w-11 h-11 rounded-xl bg-s2 text-2xl flex items-center justify-center border transition-all press"
              style={{ borderColor: ic === icon ? 'var(--acc,#7c5cfc)' : '#2a2a3a', background: ic === icon ? 'rgba(124,92,252,.15)' : '' }}
            >{ic}</button>
          ))}
        </div>
      </div>

      {/* Goal type */}
      <div className="mb-4">
        <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">Loại mục tiêu</label>
        <div className="flex bg-s2 rounded-xl p-1 gap-1">
          {SEG.map(s => (
            <button key={s.key} onClick={() => setGoalType(s.key)}
              className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${goalType === s.key ? 'bg-s3 text-t1' : 'text-t3'}`}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Goal value */}
      {goalType !== 'check' && (
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-t3 uppercase tracking-wider block mb-2">
            {goalType === 'count' ? 'Số lần mục tiêu' : 'Thời gian mục tiêu (phút)'}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number" min="1"
              className="flex-1 bg-s2 border border-bdr rounded-xl px-4 py-3 text-[15px] text-t1 outline-none focus:border-acc"
              value={goalValue} onChange={e => setGoalValue(e.target.value)}
            />
            <span className="text-t2 text-[14px]">{goalType === 'count' ? 'lần' : 'phút'}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button onClick={onClose} className="flex-1 py-[14px] rounded-xl bg-s2 border border-bdr text-t2 font-semibold press">Huỷ</button>
        <button onClick={save} className="flex-1 py-[14px] rounded-xl gradient-acc text-white font-bold press">Lưu</button>
      </div>
    </BottomSheet>
  )
}
