'use client'
import { useStore } from '@/lib/store'
import { CATS, STATUS } from '@/lib/constants'
import type { Equipment } from '@/lib/types'
import EquipmentCard from './EquipmentCard'

function useFiltered() {
  const { equipment, catFilter, statusFilter, searchQ } = useStore(s => ({
    equipment: s.equipment,
    catFilter: s.catFilter,
    statusFilter: s.statusFilter,
    searchQ: s.searchQ,
  }))
  return equipment.filter(e => {
    if (catFilter !== 'all' && e.cat !== catFilter) return false
    if (statusFilter !== 'all' && e.st !== statusFilter) return false
    if (searchQ) {
      const q = searchQ.toLowerCase()
      if (
        !e.name.toLowerCase().includes(q) &&
        !e.brand.toLowerCase().includes(q) &&
        !e.model.toLowerCase().includes(q) &&
        !e.code.toLowerCase().includes(q)
      ) return false
    }
    return true
  })
}

export function GridView() {
  const items = useFiltered()
  if (items.length === 0) return <EmptyState />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {items.map(e => <EquipmentCard key={e.id} item={e} />)}
    </div>
  )
}

export function AisleView() {
  const items = useFiltered()
  if (items.length === 0) return <EmptyState />

  // group by cat
  const groups = CATS.map(c => ({
    cat: c,
    items: items.filter(e => e.cat === c.id),
  })).filter(g => g.items.length > 0)

  return (
    <div className="space-y-8">
      {groups.map(g => (
        <section key={g.cat.id}>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="font-semibold text-[var(--ink)]">{g.cat.label}</h2>
            <span className="text-xs text-[var(--ink-5)] font-mono">{g.cat.en}</span>
            <span className="text-xs text-[var(--ink-5)]">({g.items.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {g.items.map(e => <EquipmentCard key={e.id} item={e} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

export function ShowcaseView() {
  const items = useFiltered()
  if (items.length === 0) return <EmptyState />
  return (
    <div className="space-y-2">
      {items.map(e => <ShowcaseRow key={e.id} item={e} />)}
    </div>
  )
}

function ShowcaseRow({ item }: { item: Equipment }) {
  const { openEquipment, addToCart } = useStore(s => ({ openEquipment: s.openEquipment, addToCart: s.addToCart }))
  const status = STATUS[item.st]
  const canRent = item.st === 'in'

  return (
    <div
      className="flex items-center gap-4 bg-white border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={() => openEquipment(item.id)}
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--border)] flex items-center justify-center text-xl shrink-0">
        {catIcon(item.cat)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-[var(--ink)] truncate">{item.name}</div>
        <div className="text-xs text-[var(--ink-4)]">{item.brand} {item.model} · <span className="font-mono">{item.code}</span></div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: status.color + '22', color: status.color }}>
          {status.label}
        </span>
        <span className="text-sm font-bold text-[var(--accent)] w-20 text-right">¥{item.day}/天</span>
        <button
          onClick={e => { e.stopPropagation(); if (canRent) addToCart(item.id) }}
          disabled={!canRent}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            canRent ? 'bg-[var(--accent)] text-white hover:bg-[#2347a3]' : 'bg-[var(--border)] text-[var(--ink-5)] cursor-not-allowed'
          }`}
        >
          {canRent ? '加入' : '不可租'}
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <div className="font-medium text-[var(--ink-3)]">没有找到符合条件的器材</div>
      <div className="text-sm text-[var(--ink-5)] mt-1">尝试调整筛选条件</div>
    </div>
  )
}

function catIcon(cat: string): string {
  const map: Record<string, string> = {
    cinema: '🎬', lens: '🔭', light: '💡', monitor: '🖥',
    support: '🎚', audio: '🎙', fpv: '🚁', drone: '🛸', accessory: '🔧',
  }
  return map[cat] ?? '📦'
}
