'use client'
import { useStore } from '@/lib/store'
import { CATS } from '@/lib/constants'

export default function CategoryBars() {
  const equipment = useStore(s => s.equipment)
  const maxCount = Math.max(...CATS.map(c => equipment.filter(e => e.cat === c.id).length))

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
      <div className="font-semibold text-sm text-[var(--ink)] mb-4">分类分布</div>
      <div className="space-y-3">
        {CATS.map(c => {
          const count = equipment.filter(e => e.cat === c.id).length
          const totalVal = equipment.filter(e => e.cat === c.id).reduce((s, e) => s + e.val, 0)
          if (count === 0) return null
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--ink-3)] font-medium">{c.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--ink-5)] font-mono">¥{(totalVal / 10000).toFixed(1)}万</span>
                  <span className="text-[var(--ink-4)] font-mono w-6 text-right">{count}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%`, opacity: 0.7 + (count / maxCount) * 0.3 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
