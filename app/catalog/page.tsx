'use client'
import { useStore } from '@/lib/store'
import Header from '@/components/layout/Header'
import FilterRail from '@/components/equipment/FilterRail'
import { GridView, AisleView, ShowcaseView } from '@/components/equipment/EquipmentGrid'
import EquipmentDetail from '@/components/equipment/EquipmentDetail'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

const LAYOUTS = [
  { id: 'grid', icon: '⊞', label: '网格' },
  { id: 'aisle', icon: '≡', label: '分类' },
  { id: 'showcase', icon: '☰', label: '列表' },
] as const

export default function CatalogPage() {
  const { layout, setLayout, catFilter, statusFilter, searchQ } = useStore(s => ({
    layout: s.layout,
    setLayout: s.setLayout,
    catFilter: s.catFilter,
    statusFilter: s.statusFilter,
    searchQ: s.searchQ,
  }))

  const hasFilter = catFilter !== 'all' || statusFilter !== 'all' || !!searchQ

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-56px)]">
        {/* filter rail */}
        <div className="w-44 shrink-0 overflow-y-auto border-r border-[var(--border)] p-3">
          <FilterRail />
        </div>

        {/* main content */}
        <main className="flex-1 overflow-y-auto">
          {/* top bar */}
          <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)] flex items-center gap-3 px-5 py-2.5">
            <div className="text-sm text-[var(--ink-4)]">
              {hasFilter ? '筛选结果' : '全部器材'}
            </div>
            <div className="flex-1" />
            {/* layout toggle */}
            <div className="flex items-center gap-0.5 bg-[var(--border)] rounded-lg p-0.5">
              {LAYOUTS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  title={l.label}
                  className={`px-2.5 py-1 rounded-md text-sm transition-colors ${
                    layout === l.id
                      ? 'bg-white text-[var(--ink)] shadow-sm'
                      : 'text-[var(--ink-4)] hover:text-[var(--ink)]'
                  }`}
                >
                  {l.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {layout === 'grid' && <GridView />}
            {layout === 'aisle' && <AisleView />}
            {layout === 'showcase' && <ShowcaseView />}
          </div>
        </main>
      </div>

      <EquipmentDetail />
      <CartPanel />
      <Toast />
    </>
  )
}
