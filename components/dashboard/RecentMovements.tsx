'use client'
import { useStore } from '@/lib/store'
import { OP_COLORS } from '@/lib/constants'

export default function RecentMovements() {
  const movements = useStore(s => s.movements)
  const recent = movements.slice(0, 8)

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
      <div className="font-semibold text-sm text-[var(--ink)] mb-4">近期操作记录</div>
      {recent.length === 0 ? (
        <div className="text-sm text-[var(--ink-5)] text-center py-8">暂无记录</div>
      ) : (
        <div className="space-y-0 -mx-5">
          {recent.map(m => {
            const color = OP_COLORS[m.op] ?? 'var(--ink-4)'
            return (
              <div key={m.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--border)]/30 transition-colors">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0"
                  style={{ background: color + '20', color }}
                >
                  {m.op}
                </span>
                <span className="text-sm text-[var(--ink-2)] flex-1 truncate">{m.dev}</span>
                <span className="text-xs text-[var(--ink-4)] shrink-0">{m.by}</span>
                <span className="text-[10px] text-[var(--ink-5)] font-mono shrink-0">{m.t.slice(0, 10)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
