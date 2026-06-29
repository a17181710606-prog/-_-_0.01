'use client'
import { useStore } from '@/lib/store'
import { STATUS, catEn } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { Equipment } from '@/lib/types'

interface Props {
  item: Equipment
}

// 斜纹占位底 —— 与设计稿 Card.dc.html 一致
const HATCH = 'repeating-linear-gradient(135deg, #F4F3F0 0 9px, #EFEEEA 9px 18px)'

export default function EquipmentCard({ item }: Props) {
  const { openEquipment, addToCart, cart } = useStore(s => ({
    openEquipment: s.openEquipment,
    addToCart: s.addToCart,
    cart: s.cart,
  }))
  const status = STATUS[item.st]
  const qty = cart.find(c => c.equipmentId === item.id)?.qty ?? 0
  const inCart = qty > 0

  return (
    <div
      onClick={() => openEquipment(item.id)}
      className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer border border-[#E9E8E4] transition-all duration-150 hover:border-[#CFCEC8] hover:shadow-[0_8px_24px_rgba(20,20,18,0.08)] hover:-translate-y-0.5"
    >
      {/* 缩略图：斜纹底 + 型号大字 + 左上类别小标 */}
      <div className="relative flex items-center justify-center" style={{ aspectRatio: '4 / 3', background: HATCH }}>
        <div className="font-mono uppercase" style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#AEACA3' }}>
          {item.model}
        </div>
        <div className="absolute font-mono uppercase" style={{ top: '10px', left: '11px', fontSize: '9px', letterSpacing: '0.14em', color: '#BCBAB1' }}>
          {catEn(item.cat)}
        </div>
      </div>

      {/* 信息区 */}
      <div className="flex flex-col flex-1" style={{ padding: '13px 14px 14px', gap: '7px' }}>
        <div className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.07em', color: '#9C9A93' }}>
          {item.brand}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1C1B19', lineHeight: 1.35, height: '38px', overflow: 'hidden' }}>
          {item.name}
        </div>

        {/* 状态 + 可借 */}
        <div className="flex items-center" style={{ gap: '7px', fontSize: '12px', color: '#76746E' }}>
          <span className="inline-block shrink-0" style={{ width: '6px', height: '6px', borderRadius: '999px', background: status.color }} />
          <span>{status.label}</span>
          <span style={{ color: '#CFCDC6' }}>·</span>
          <span className="font-mono" style={{ fontSize: '11px', color: '#9C9A93' }}>可借 {item.av}/{item.tot}</span>
        </div>

        {/* 价格 + 按钮 */}
        <div className="flex items-end justify-between" style={{ marginTop: '5px', paddingTop: '11px', borderTop: '1px solid #F2F1ED', gap: '8px' }}>
          <div className="flex items-baseline" style={{ gap: '3px' }}>
            <span className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: '#1C1B19' }}>{fmtCNY(item.day)}</span>
            <span style={{ fontSize: '11px', color: '#9C9A93' }}>/天</span>
          </div>
          {inCart ? (
            <button
              onClick={e => { e.stopPropagation(); addToCart(item.id) }}
              className="flex items-center whitespace-nowrap cursor-pointer"
              style={{ fontSize: '12px', padding: '6px 11px', borderRadius: '8px', border: '1px solid #2F5AC7', background: '#2F5AC7', color: '#fff', gap: '5px' }}
            >
              已加入 · {qty}
            </button>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); addToCart(item.id) }}
              className="whitespace-nowrap cursor-pointer transition-colors hover:!border-[#2F5AC7] hover:!bg-[#EEF2FD]"
              style={{ fontSize: '12px', padding: '6px 11px', borderRadius: '8px', border: '1px solid #DAD8D2', background: '#fff', color: '#2F5AC7' }}
            >
              加入清单
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
