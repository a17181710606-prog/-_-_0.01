'use client'
import { useStore } from '@/lib/store'
import { STATUS } from '@/lib/constants'
import type { StatusKey } from '@/lib/types'

export default function StatusDistribution() {
  const equipment = useStore(s => s.equipment)
  const total = equipment.length

  const bars = (Object.keys(STATUS) as StatusKey[]).map(k => {
    const count = equipment.filter(e => e.st === k).length
    const pct = total ? (count / total) * 100 : 0
    return { key: k, label: STATUS[k].label, color: STATUS[k].color, count, pct, pctText: Math.round(pct) + '%' }
  }).filter(b => b.count > 0)

  return (
    <div style={{ background: '#fff', border: '1px solid #E9E8E4', borderRadius: '14px', padding: '19px' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600 }}>状态分布</h3>

      {/* bar */}
      <div className="flex overflow-hidden" style={{ height: '14px', borderRadius: '7px', marginBottom: '16px', background: '#F1F0EC' }}>
        {bars.map(b => (
          <div key={b.key} style={{ width: `${b.pct}%`, background: b.color, height: '100%' }} title={`${b.label} ${b.count}`} />
        ))}
      </div>

      {/* 2-col legend */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px 18px' }}>
        {bars.map(b => (
          <div key={b.key} className="flex items-center" style={{ gap: '8px', fontSize: '13px' }}>
            <span className="inline-block shrink-0" style={{ width: '9px', height: '9px', borderRadius: '3px', background: b.color }} />
            <span style={{ color: '#44423D' }}>{b.label}</span>
            <span className="flex-1" />
            <span className="font-mono" style={{ color: '#1C1B19' }}>{b.count}</span>
            <span className="font-mono text-right" style={{ fontSize: '11px', color: '#A6A49C', width: '38px' }}>{b.pctText}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
