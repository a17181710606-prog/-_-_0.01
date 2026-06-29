'use client'
import { useStore } from '@/lib/store'
import Header from '@/components/layout/Header'
import { GridView, AisleView, ShowcaseView } from '@/components/equipment/EquipmentGrid'
import EquipmentDetail from '@/components/equipment/EquipmentDetail'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

const LAYOUTS = [
  { id: 'grid', label: '货架网格' },
  { id: 'aisle', label: '分区货架' },
  { id: 'showcase', label: '大图筛选' },
] as const

const SORTS = [
  { value: 'featured', label: '推荐' },
  { value: 'priceAsc', label: '日租 低→高' },
  { value: 'priceDesc', label: '日租 高→低' },
  { value: 'avail', label: '可借数量' },
] as const

export default function CatalogPage() {
  const { layout, setLayout, sortBy, setSortBy, equipment } = useStore(s => ({
    layout: s.layout,
    setLayout: s.setLayout,
    sortBy: s.sortBy,
    setSortBy: s.setSortBy,
    equipment: s.equipment,
  }))

  const totalCount = equipment.length
  const totalAvail = equipment.reduce((sum, e) => sum + e.av, 0)

  // 结果数（与各布局共享的筛选保持一致由各视图内部展示，这里给标题用总数）
  const resultCount = equipment.length

  return (
    <>
      <Header />
      <main className="flex-1 w-full mx-auto" style={{ maxWidth: '1440px', padding: '22px 22px 60px' }}>
        {/* 标题 + 布局切换 */}
        <div className="flex items-end justify-between flex-wrap" style={{ gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>器材超市</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#76746E' }}>
              逛着挑设备 · 加入清单凑一套 · 共 <span className="font-mono" style={{ color: '#44423D' }}>{totalCount}</span> 件器材，当前可借 <span className="font-mono" style={{ color: '#44423D' }}>{totalAvail}</span> 件
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '14px' }}>
            <div style={{ fontSize: '12px', color: '#9C9A93' }}>布局方案</div>
            <div className="flex" style={{ padding: '3px', background: '#F1F0EC', borderRadius: '10px', gap: '2px' }}>
              {LAYOUTS.map(lo => {
                const active = layout === lo.id
                return (
                  <button
                    key={lo.id}
                    onClick={() => setLayout(lo.id)}
                    className="cursor-pointer transition-all"
                    style={{
                      padding: '7px 14px', borderRadius: '8px', border: 'none', fontSize: '13px',
                      background: active ? '#fff' : 'transparent',
                      color: active ? '#1C1B19' : '#76746E',
                      fontWeight: active ? 600 : 400,
                      boxShadow: active ? '0 1px 3px rgba(20,20,18,0.10)' : 'none',
                    }}
                  >
                    {lo.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 结果数 + 排序 */}
        <div className="flex items-center justify-between flex-wrap" style={{ gap: '14px', marginBottom: '18px' }}>
          <div style={{ fontSize: '13px', color: '#76746E' }}>
            共 <span className="font-mono" style={{ color: '#1C1B19', fontWeight: 500 }}>{resultCount}</span> 件结果
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9C9A93' }}>排序</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]"
              style={{ height: '34px', padding: '0 30px 0 11px', border: '1px solid #E4E3DE', borderRadius: '8px', background: '#fff', fontSize: '13px', color: '#44423D' }}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {layout === 'grid' && <GridView />}
        {layout === 'aisle' && <AisleView />}
        {layout === 'showcase' && <ShowcaseView />}
      </main>

      <EquipmentDetail />
      <CartPanel />
      <Toast />
    </>
  )
}
