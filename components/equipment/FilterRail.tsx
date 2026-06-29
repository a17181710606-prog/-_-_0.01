'use client'
import { useStore } from '@/lib/store'
import { CATS, STATUS, catEn } from '@/lib/constants'
import type { CatKey, StatusKey } from '@/lib/types'

const SELECT_CLS = 'h-[34px] pl-[10px] pr-7 border border-[#E4E3DE] rounded-lg bg-white text-[13px] text-[#44423D] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]'

export default function FilterRail() {
  const {
    catFilter, setCatFilter, statusFilter, setStatusFilter,
    brandFilter, setBrandFilter, resetFilters, equipment,
  } = useStore(s => ({
    catFilter: s.catFilter,
    setCatFilter: s.setCatFilter,
    statusFilter: s.statusFilter,
    setStatusFilter: s.setStatusFilter,
    brandFilter: s.brandFilter,
    setBrandFilter: s.setBrandFilter,
    resetFilters: s.resetFilters,
    equipment: s.equipment,
  }))

  const counts: Record<string, number> = {}
  equipment.forEach(e => { counts[e.cat] = (counts[e.cat] || 0) + 1 })
  const cats = [
    { id: 'all' as const, label: '全部器材', count: equipment.length },
    ...CATS.map(c => ({ id: c.id, label: c.label, count: counts[c.id] || 0 })),
  ]

  const brands = Array.from(new Set(equipment.map(e => e.brand))).sort()

  return (
    <aside className="w-[218px] shrink-0 sticky" style={{ top: '84px' }}>
      <div className="font-semibold uppercase mb-[9px]" style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#9C9A93' }}>分类</div>
      <div className="flex flex-col mb-[18px]" style={{ gap: '2px' }}>
        {cats.map(c => {
          const active = catFilter === c.id
          return (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id as CatKey | 'all')}
              className="flex items-center justify-between w-full text-left cursor-pointer transition-colors"
              style={{
                padding: '8px 11px', borderRadius: '8px', fontSize: '13px',
                background: active ? '#EEF2FD' : 'transparent',
                color: active ? '#2F5AC7' : '#44423D',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span>{c.label}</span>
              <span className="font-mono" style={{ fontSize: '11px', opacity: 0.7 }}>{c.count}</span>
            </button>
          )
        })}
      </div>

      <div style={{ height: '1px', background: '#EAE9E5', margin: '0 0 16px' }} />

      <div className="flex flex-col" style={{ gap: '12px' }}>
        <label className="flex flex-col" style={{ gap: '5px', fontSize: '12px', color: '#9C9A93' }}>
          品牌
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className={SELECT_CLS}>
            <option value="all">全部品牌</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="flex flex-col" style={{ gap: '5px', fontSize: '12px', color: '#9C9A93' }}>
          状态
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusKey | 'all')} className={SELECT_CLS}>
            <option value="all">全部状态</option>
            {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <button
          onClick={resetFilters}
          className="self-start cursor-pointer bg-transparent border-0 p-0"
          style={{ marginTop: '4px', fontSize: '12px', color: '#2F5AC7' }}
        >
          重置筛选
        </button>
      </div>
    </aside>
  )
}
