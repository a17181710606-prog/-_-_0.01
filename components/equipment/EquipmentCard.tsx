'use client'
import { useStore } from '@/lib/store'
import { STATUS } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { Equipment } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface Props {
  item: Equipment
}

export default function EquipmentCard({ item }: Props) {
  const { openEquipment, addToCart } = useStore(s => ({
    openEquipment: s.openEquipment,
    addToCart: s.addToCart,
  }))
  const status = STATUS[item.st]
  const canRent = item.st === 'in'

  return (
    <div
      className="bg-white rounded-xl border border-[var(--border)] overflow-hidden cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
      onClick={() => openEquipment(item.id)}
    >
      {/* image placeholder */}
      <div className="h-32 bg-gradient-to-br from-[var(--border)] to-[var(--border-2)] flex items-center justify-center relative overflow-hidden">
        <div className="text-[var(--ink-5)] text-4xl select-none">{catIcon(item.cat)}</div>
        <div className="absolute top-2 right-2">
          <Badge color={status.color} label={status.label} />
        </div>
      </div>

      {/* info */}
      <div className="p-3">
        <div className="text-[11px] text-[var(--ink-5)] font-mono mb-0.5">{item.code}</div>
        <div className="text-sm font-semibold text-[var(--ink)] leading-tight line-clamp-2 mb-1">{item.name}</div>
        <div className="text-[11px] text-[var(--ink-4)] mb-2">{item.brand} {item.model}</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--accent)]">
            {fmtCNY(item.day)}<span className="text-xs font-normal text-[var(--ink-5)]">/天</span>
          </span>
          <button
            onClick={e => { e.stopPropagation(); if (canRent) addToCart(item.id) }}
            disabled={!canRent}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
              canRent
                ? 'bg-[var(--accent)] text-white hover:bg-[#2347a3]'
                : 'bg-[var(--border)] text-[var(--ink-5)] cursor-not-allowed'
            }`}
          >
            {canRent ? '加入清单' : '不可租'}
          </button>
        </div>
      </div>
    </div>
  )
}

function catIcon(cat: string): string {
  const map: Record<string, string> = {
    cinema: '🎬', lens: '🔭', light: '💡', monitor: '🖥',
    support: '🎚', audio: '🎙', fpv: '🚁', drone: '🛸', accessory: '🔧',
  }
  return map[cat] ?? '📦'
}
