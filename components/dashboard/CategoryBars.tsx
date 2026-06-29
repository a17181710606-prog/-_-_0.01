'use client'
import { useStore } from '@/lib/store'
import { CATS } from '@/lib/constants'

export default function CategoryBars() {
  const equipment = useStore(s => s.equipment)

  const maxCat = Math.max(...CATS.map(c => equipment.filter(e => e.cat === c.id).reduce((s, e) => s + e.tot, 0)), 1)

  return (
    <div style={{ background: '#fff', border: '1px solid #E9E8E4', borderRadius: '14px', padding: '19px' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600 }}>类别库存</h3>
      <div className="flex flex-col" style={{ gap: '12px' }}>
        {CATS.map(c => {
          const items = equipment.filter(e => e.cat === c.id)
          const tot = items.reduce((s, e) => s + e.tot, 0)
          const av = items.reduce((s, e) => s + e.av, 0)
          return (
            <div key={c.id} className="flex items-center" style={{ gap: '12px' }}>
              <span className="shrink-0" style={{ width: '70px', fontSize: '13px', color: '#44423D' }}>{c.label}</span>
              <div className="flex-1 overflow-hidden" style={{ height: '8px', borderRadius: '5px', background: '#F1F0EC' }}>
                <div style={{ width: `${(tot / maxCat) * 100}%`, height: '100%', background: 'oklch(0.55 0.13 258)', borderRadius: '5px' }} />
              </div>
              <span className="font-mono text-right shrink-0" style={{ fontSize: '12px', color: '#76746E', width: '54px' }}>{av}/{tot}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
