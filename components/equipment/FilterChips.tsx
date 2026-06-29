'use client'
import { useStore } from '@/lib/store'
import { CATS, STATUS } from '@/lib/constants'
import type { CatKey, StatusKey } from '@/lib/types'

const SELECT_CLS = 'h-[34px] pl-[11px] pr-7 border border-[#E4E3DE] rounded-lg bg-white text-[13px] text-[#44423D] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]'

export function CatChips() {
  const { catFilter, setCatFilter, equipment } = useStore(s => ({
    catFilter: s.catFilter,
    setCatFilter: s.setCatFilter,
    equipment: s.equipment,
  }))
  const cats = [{ id: 'all' as const, label: '全部器材' }, ...CATS.map(c => ({ id: c.id, label: c.label }))]
  void equipment
  return (
    <div className="flex flex-wrap" style={{ gap: '8px' }}>
      {cats.map(c => {
        const active = catFilter === c.id
        return (
          <button
            key={c.id}
            onClick={() => setCatFilter(c.id as CatKey | 'all')}
            className="whitespace-nowrap cursor-pointer transition-all"
            style={{
              padding: '7px 14px', borderRadius: '999px', fontSize: '13px',
              background: active ? '#1C1B19' : '#fff',
              color: active ? '#fff' : '#44423D',
              border: active ? '1px solid #1C1B19' : '1px solid #E4E3DE',
            }}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}

export function BrandStatusSelects({ showReset = false, resetLabel = '重置' }: { showReset?: boolean; resetLabel?: string }) {
  const {
    brandFilter, setBrandFilter, statusFilter, setStatusFilter, resetFilters, equipment,
  } = useStore(s => ({
    brandFilter: s.brandFilter,
    setBrandFilter: s.setBrandFilter,
    statusFilter: s.statusFilter,
    setStatusFilter: s.setStatusFilter,
    resetFilters: s.resetFilters,
    equipment: s.equipment,
  }))
  const brands = Array.from(new Set(equipment.map(e => e.brand))).sort()
  return (
    <>
      <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className={SELECT_CLS}>
        <option value="all">全部品牌</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusKey | 'all')} className={SELECT_CLS}>
        <option value="all">全部状态</option>
        {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      {showReset && (
        <button onClick={resetFilters} className="cursor-pointer bg-transparent border-0 p-0" style={{ fontSize: '12px', color: '#2F5AC7' }}>
          {resetLabel}
        </button>
      )}
    </>
  )
}
