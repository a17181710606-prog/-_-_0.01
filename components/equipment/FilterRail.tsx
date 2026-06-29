'use client'
import { useStore } from '@/lib/store'
import { CATS, STATUS } from '@/lib/constants'
import type { CatKey, StatusKey } from '@/lib/types'

export default function FilterRail() {
  const { catFilter, setCatFilter, statusFilter, setStatusFilter, equipment } = useStore(s => ({
    catFilter: s.catFilter,
    setCatFilter: s.setCatFilter,
    statusFilter: s.statusFilter,
    setStatusFilter: s.setStatusFilter,
    equipment: s.equipment,
  }))

  const countByCat = (cat: CatKey | 'all') =>
    cat === 'all' ? equipment.length : equipment.filter(e => e.cat === cat).length

  return (
    <aside className="w-44 shrink-0 space-y-5">
      {/* category */}
      <div>
        <div className="text-[11px] font-semibold text-[var(--ink-5)] uppercase tracking-wide mb-2 px-2">分类</div>
        <div className="space-y-0.5">
          <FilterBtn
            active={catFilter === 'all'}
            onClick={() => setCatFilter('all')}
            label="全部器材"
            count={countByCat('all')}
          />
          {CATS.map(c => (
            <FilterBtn
              key={c.id}
              active={catFilter === c.id}
              onClick={() => setCatFilter(c.id as CatKey)}
              label={c.label}
              count={countByCat(c.id as CatKey)}
            />
          ))}
        </div>
      </div>

      {/* status */}
      <div>
        <div className="text-[11px] font-semibold text-[var(--ink-5)] uppercase tracking-wide mb-2 px-2">状态</div>
        <div className="space-y-0.5">
          <FilterBtn
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            label="全部状态"
          />
          {(Object.entries(STATUS) as [StatusKey, { label: string; color: string }][]).map(([key, def]) => (
            <FilterBtn
              key={key}
              active={statusFilter === key}
              onClick={() => setStatusFilter(key)}
              label={def.label}
              dot={def.color}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

function FilterBtn({
  active, onClick, label, count, dot,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
  dot?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
        active
          ? 'bg-[var(--accent-sel)] text-[var(--accent)] font-medium'
          : 'text-[var(--ink-3)] hover:bg-[var(--border)] hover:text-[var(--ink)]'
      }`}
    >
      <span className="flex items-center gap-2">
        {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />}
        {label}
      </span>
      {count !== undefined && (
        <span className={`text-[11px] ${active ? 'text-[var(--accent)]' : 'text-[var(--ink-5)]'}`}>{count}</span>
      )}
    </button>
  )
}
