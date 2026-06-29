'use client'
import { useStore } from '@/lib/store'
import { OP_COLORS } from '@/lib/constants'

export default function RecentMovements() {
  const movements = useStore(s => s.movements)
  const records = movements.slice(0, 6)

  return (
    <div style={{ background: '#fff', border: '1px solid #E9E8E4', borderRadius: '14px', padding: '19px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>最近出入库记录</h3>
        <span style={{ fontSize: '12px', color: '#A6A49C' }}>实时</span>
      </div>
      <div className="flex flex-col">
        {records.map(r => {
          const c = OP_COLORS[r.op] ?? '#9C9A93'
          return (
            <div key={r.id} className="flex items-center" style={{ gap: '12px', padding: '10px 0', borderBottom: '1px solid #F2F1ED' }}>
              <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '6px', color: c, background: `color-mix(in oklch, ${c} 14%, white)`, fontWeight: 500, whiteSpace: 'nowrap' }}>{r.op}</span>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '13px', color: '#1C1B19' }}>{r.dev}</div>
                {r.proj && <div style={{ fontSize: '11px', color: '#A6A49C', marginTop: '2px' }}>{r.proj}</div>}
              </div>
              <div className="text-right shrink-0">
                <div style={{ fontSize: '12px', color: '#76746E' }}>{r.by}</div>
                <div className="font-mono" style={{ fontSize: '11px', color: '#A6A49C', marginTop: '2px' }}>{r.t}</div>
              </div>
            </div>
          )
        })}
        {records.length === 0 && <div style={{ padding: '30px', textAlign: 'center', color: '#9C9A93', fontSize: '13px' }}>暂无记录</div>}
      </div>
    </div>
  )
}
