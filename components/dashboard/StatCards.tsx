'use client'
import { useStore } from '@/lib/store'
import { STATUS } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'

export default function StatCards() {
  const equipment = useStore(s => s.equipment)

  const total = equipment.length
  const inStock = equipment.filter(e => e.st === 'in').length
  const outStock = equipment.filter(e => e.st === 'out').length
  const totalVal = equipment.reduce((s, e) => s + e.val, 0)
  const dayRevPotential = equipment.filter(e => e.st === 'in').reduce((s, e) => s + e.day, 0)

  const stats = [
    { label: '器材总数', value: total + ' 件', sub: '在库 ' + inStock + ' 件', color: 'var(--accent)' },
    { label: '已出库', value: outStock + ' 件', sub: '出库率 ' + Math.round(outStock / total * 100) + '%', color: 'oklch(0.62 0.08 255)' },
    { label: '资产总值', value: fmtCNY(totalVal), sub: '含自有及挂靠设备', color: 'oklch(0.64 0.11 152)' },
    { label: '日租收益上限', value: fmtCNY(dayRevPotential), sub: '当前在库可租设备', color: 'oklch(0.74 0.12 78)' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-[var(--border)] p-5">
          <div className="text-xs text-[var(--ink-5)] font-medium mb-1">{s.label}</div>
          <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs text-[var(--ink-4)] mt-1">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
