'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { STATUS, catEn, catLabel, OP_COLORS } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import SlideOver from '@/components/ui/SlideOver'

const HERO_HATCH = 'repeating-linear-gradient(135deg, #F4F3F0 0 11px, #EFEEEA 11px 22px)'

export default function EquipmentDetail() {
  const { equipment, movements, selectedEquipmentId, closeEquipment, addToCart } = useStore(s => ({
    equipment: s.equipment,
    movements: s.movements,
    selectedEquipmentId: s.selectedEquipmentId,
    closeEquipment: s.closeEquipment,
    addToCart: s.addToCart,
  }))

  const [qty, setQty] = useState(1)
  useEffect(() => { setQty(1) }, [selectedEquipmentId])

  const item = equipment.find(e => e.id === selectedEquipmentId)
  const status = item ? STATUS[item.st] : null
  const records = item ? movements.filter(m => m.dev.includes(item.name) || item.name.includes(m.dev.split(' ')[0])).slice(0, 4) : []

  return (
    <SlideOver open={!!selectedEquipmentId} onClose={closeEquipment} width="w-[520px]" title={item ? `${catLabel(item.cat)} / ${item.code}` : ''}>
      {item && status && (
        <div style={{ padding: '20px' }}>
          {/* hero */}
          <div className="relative flex items-center justify-center" style={{ aspectRatio: '16 / 10', borderRadius: '14px', background: HERO_HATCH, marginBottom: '20px' }}>
            <span className="font-mono" style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#AEACA3' }}>{item.model}</span>
            <span className="absolute font-mono" style={{ top: '13px', left: '14px', fontSize: '10px', letterSpacing: '0.14em', color: '#BCBAB1' }}>{catEn(item.cat)}</span>
            <span className="absolute" style={{ bottom: '12px', right: '14px', fontSize: '11px', color: '#B6B4AC' }}>产品图占位</span>
          </div>

          <div className="font-mono uppercase" style={{ fontSize: '11px', letterSpacing: '0.07em', color: '#9C9A93', marginBottom: '6px' }}>{item.brand}</div>
          <h2 style={{ margin: '0 0 12px', fontSize: '21px', fontWeight: 700, lineHeight: 1.25 }}>{item.name}</h2>

          <div className="flex items-center flex-wrap" style={{ gap: '9px', fontSize: '13px', color: '#76746E', marginBottom: '20px' }}>
            <span className="flex items-center" style={{ gap: '6px' }}>
              <span className="inline-block" style={{ width: '6px', height: '6px', borderRadius: '999px', background: status.color }} />
              {status.label}
            </span>
            <span style={{ color: '#CFCDC6' }}>·</span>
            <span className="font-mono">可借 {item.av}/{item.tot}</span>
          </div>

          {/* stat cards */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: '日租参考', value: fmtCNY(item.day), color: '#2F5AC7' },
              { label: '押金参考', value: fmtCNY(item.dep), color: '#1C1B19' },
              { label: '设备估值', value: fmtCNY(item.val), color: '#1C1B19' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8F7F4', borderRadius: '11px', padding: '13px' }}>
                <div style={{ fontSize: '11px', color: '#9C9A93', marginBottom: '6px' }}>{s.label}</div>
                <div className="font-mono" style={{ fontSize: '17px', fontWeight: 600, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* qty + add */}
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '24px' }}>
            <div className="flex items-center overflow-hidden" style={{ border: '1px solid #E4E3DE', borderRadius: '9px' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '36px', height: '42px', border: 'none', background: '#fff', cursor: 'pointer', color: '#44423D', fontSize: '18px' }}>−</button>
              <span className="font-mono text-center" style={{ minWidth: '40px', fontSize: '15px' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: '36px', height: '42px', border: 'none', background: '#fff', cursor: 'pointer', color: '#44423D', fontSize: '18px' }}>+</button>
            </div>
            <button
              onClick={() => { for (let i = 0; i < qty; i++) addToCart(item.id); closeEquipment() }}
              className="flex-1 flex items-center justify-center cursor-pointer"
              style={{ height: '46px', borderRadius: '11px', background: '#1C1B19', color: '#fff', border: 'none', fontSize: '15px', gap: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <line x1="8" y1="3.5" x2="8" y2="12.5" strokeLinecap="round" />
                <line x1="3.5" y1="8" x2="12.5" y2="8" strokeLinecap="round" />
              </svg>
              加入清单
            </button>
          </div>

          {/* specs */}
          {item.specs.length > 0 && (
            <>
              <h3 style={{ margin: '0 0 11px', fontSize: '14px', fontWeight: 600 }}>关键参数</h3>
              <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '24px' }}>
                {item.specs.map((sp, i) => (
                  <span key={i} style={{ padding: '6px 12px', background: '#F3F2EE', borderRadius: '8px', fontSize: '13px', color: '#44423D' }}>{sp}</span>
                ))}
              </div>
            </>
          )}

          {/* ledger */}
          <h3 style={{ margin: '0 0 11px', fontSize: '14px', fontWeight: 600 }}>台账信息</h3>
          <div className="flex flex-col overflow-hidden" style={{ marginBottom: '24px', border: '1px solid #EEEDE9', borderRadius: '11px' }}>
            <LedgerRow label="编号" value={item.code} border />
            <LedgerRow label="存放位置" value={`货架 ${item.loc}`} border />
            <LedgerRow label="总数 / 可借" value={`${item.tot} / ${item.av} 可借`} />
          </div>

          {/* note */}
          {item.note && (
            <>
              <h3 style={{ margin: '0 0 9px', fontSize: '14px', fontWeight: 600 }}>备注</h3>
              <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#76746E', lineHeight: 1.6 }}>{item.note}</p>
            </>
          )}

          {/* records */}
          {records.length > 0 && (
            <>
              <h3 style={{ margin: '0 0 11px', fontSize: '14px', fontWeight: 600 }}>出入库记录</h3>
              <div className="flex flex-col">
                {records.map(r => {
                  const c = OP_COLORS[r.op] ?? '#9C9A93'
                  return (
                    <div key={r.id} className="flex items-center" style={{ gap: '12px', padding: '9px 0', borderBottom: '1px solid #F2F1ED', fontSize: '13px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '6px', color: c, background: `color-mix(in oklch, ${c} 14%, white)`, fontWeight: 500, whiteSpace: 'nowrap' }}>{r.op}</span>
                      <span className="flex-1" style={{ color: '#44423D' }}>{r.by}</span>
                      <span className="font-mono" style={{ fontSize: '12px', color: '#A6A49C' }}>{r.t}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </SlideOver>
  )
}

function LedgerRow({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className="flex justify-between" style={{ padding: '11px 14px', fontSize: '13px', borderBottom: border ? '1px solid #F2F1ED' : 'none' }}>
      <span style={{ color: '#9C9A93' }}>{label}</span>
      <span className="font-mono" style={{ color: '#1C1B19' }}>{value}</span>
    </div>
  )
}
