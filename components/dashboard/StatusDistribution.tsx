'use client'
import { useStore } from '@/lib/store'
import { STATUS } from '@/lib/constants'
import type { StatusKey } from '@/lib/types'

export default function StatusDistribution() {
  const equipment = useStore(s => s.equipment)
  const total = equipment.length

  const counts = (Object.entries(STATUS) as [StatusKey, { label: string; color: string }][]).map(([key, def]) => ({
    key,
    label: def.label,
    color: def.color,
    count: equipment.filter(e => e.st === key).length,
  })).filter(c => c.count > 0)

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
      <div className="font-semibold text-sm text-[var(--ink)] mb-4">状态分布</div>

      {/* bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
        {counts.map(c => (
          <div
            key={c.key}
            className="h-full rounded-full transition-all"
            style={{ width: `${(c.count / total) * 100}%`, background: c.color }}
            title={`${c.label}: ${c.count}`}
          />
        ))}
      </div>

      <div className="space-y-2">
        {counts.map(c => (
          <div key={c.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="text-[var(--ink-3)]">{c.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--ink-4)] text-xs">{Math.round(c.count / total * 100)}%</span>
              <span className="font-semibold text-[var(--ink)] font-mono w-8 text-right">{c.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
