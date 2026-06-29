'use client'
import { useStore } from '@/lib/store'
import { CATS } from '@/lib/constants'
import EquipmentCard from './EquipmentCard'
import FilterRail from './FilterRail'
import { CatChips, BrandStatusSelects } from './FilterChips'

// 共享筛选 + 排序，与设计稿 filtered() 一致
function useFiltered() {
  const { equipment, catFilter, brandFilter, statusFilter, searchQ, sortBy } = useStore(s => ({
    equipment: s.equipment,
    catFilter: s.catFilter,
    brandFilter: s.brandFilter,
    statusFilter: s.statusFilter,
    searchQ: s.searchQ,
    sortBy: s.sortBy,
  }))
  let list = equipment.slice()
  if (catFilter !== 'all') list = list.filter(e => e.cat === catFilter)
  if (brandFilter !== 'all') list = list.filter(e => e.brand === brandFilter)
  if (statusFilter !== 'all') list = list.filter(e => e.st === statusFilter)
  if (searchQ.trim()) {
    const q = searchQ.trim().toLowerCase()
    list = list.filter(e => (e.name + ' ' + e.brand + ' ' + e.model + ' ' + e.code).toLowerCase().includes(q))
  }
  if (sortBy === 'priceAsc') list.sort((a, b) => a.day - b.day)
  else if (sortBy === 'priceDesc') list.sort((a, b) => b.day - a.day)
  else if (sortBy === 'avail') list.sort((a, b) => b.av - a.av)
  return list
}

function NoResults() {
  const resetFilters = useStore(s => s.resetFilters)
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#9C9A93', fontSize: '14px' }}>
      没有符合条件的器材，试试{' '}
      <button onClick={resetFilters} className="cursor-pointer bg-transparent border-0" style={{ color: '#2F5AC7', fontSize: '14px' }}>
        重置筛选
      </button>
    </div>
  )
}

// LAYOUT A：货架网格（rail + grid）
export function GridView() {
  const items = useFiltered()
  return (
    <div className="flex items-start" style={{ gap: '24px' }}>
      <FilterRail />
      <div className="flex-1 min-w-0">
        {items.length > 0 ? (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(216px, 1fr))', gap: '16px' }}>
            {items.map(e => <EquipmentCard key={e.id} item={e} />)}
          </div>
        ) : <NoResults />}
      </div>
    </div>
  )
}

// LAYOUT B：分区货架（chips + 横向滚动分区）
export function AisleView() {
  const items = useFiltered()
  const setCatFilter = useStore(s => s.setCatFilter)
  const setLayout = useStore(s => s.setLayout)

  const aisles = CATS.map(c => ({
    cat: c,
    items: items.filter(e => e.cat === c.id),
  })).filter(a => a.items.length > 0)

  return (
    <div>
      <div className="mb-[14px]"><CatChips /></div>
      <div className="flex flex-wrap items-center mb-6" style={{ gap: '10px' }}>
        <BrandStatusSelects />
      </div>

      {aisles.length > 0 ? (
        <div className="flex flex-col" style={{ gap: '30px' }}>
          {aisles.map(a => (
            <section key={a.cat.id}>
              <div className="flex items-center mb-[13px]" style={{ gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{a.cat.label}</h2>
                <span className="font-mono" style={{ fontSize: '11px', color: '#A6A49C' }}>{a.cat.en}</span>
                <span style={{ fontSize: '12px', color: '#9C9A93' }}>· {a.items.length} 件</span>
                <div className="flex-1" style={{ height: '1px', background: '#EAE9E5' }} />
                <button
                  onClick={() => { setCatFilter(a.cat.id); setLayout('grid') }}
                  className="cursor-pointer bg-transparent border-0 whitespace-nowrap"
                  style={{ fontSize: '12px', color: '#2F5AC7' }}
                >
                  查看全部 →
                </button>
              </div>
              <div className="flex overflow-x-auto" style={{ gap: '14px', paddingBottom: '8px', scrollSnapType: 'x proximity' }}>
                {a.items.map(e => (
                  <div key={e.id} className="shrink-0" style={{ width: '218px', scrollSnapAlign: 'start' }}>
                    <EquipmentCard item={e} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <NoResults />}
    </div>
  )
}

// LAYOUT C：大图筛选（toolbar + 宽松卡片网格）
export function ShowcaseView() {
  const items = useFiltered()
  return (
    <div>
      <div className="bg-white flex flex-col" style={{ border: '1px solid #E9E8E4', borderRadius: '14px', padding: '16px 18px', marginBottom: '24px', gap: '14px' }}>
        <CatChips />
        <div className="flex flex-wrap items-center" style={{ gap: '10px', paddingTop: '13px', borderTop: '1px solid #F2F1ED' }}>
          <span style={{ fontSize: '12px', color: '#9C9A93' }}>精细筛选</span>
          <BrandStatusSelects showReset resetLabel="重置" />
        </div>
      </div>
      {items.length > 0 ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
          {items.map(e => <EquipmentCard key={e.id} item={e} />)}
        </div>
      ) : <NoResults />}
    </div>
  )
}
