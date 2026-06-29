'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { fmtCNY } from '@/lib/utils'
import SlideOver from '@/components/ui/SlideOver'

export default function CartPanel() {
  const { cartOpen, setCartOpen, cart, equipment, removeFromCart, clearCart, submitCart } = useStore(s => ({
    cartOpen: s.cartOpen,
    setCartOpen: s.setCartOpen,
    cart: s.cart,
    equipment: s.equipment,
    removeFromCart: s.removeFromCart,
    clearCart: s.clearCart,
    submitCart: s.submitCart,
  }))

  const [proj, setProj] = useState('')
  const [days, setDays] = useState(1)

  const items = cart.map(c => {
    const eq = equipment.find(e => e.id === c.equipmentId)
    return eq ? { ...c, eq } : null
  }).filter(Boolean) as { equipmentId: number; qty: number; eq: (typeof equipment)[0] }[]

  const total = items.reduce((sum, i) => sum + i.eq.day * i.qty * days, 0)

  const handleSubmit = () => {
    if (!proj) return
    submitCart(proj, days)
    setProj('')
    setDays(1)
  }

  return (
    <SlideOver
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title={`租用清单 (${cart.length})`}
      width="w-[420px]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="text-5xl mb-3">🛒</div>
              <div className="text-[var(--ink-3)] font-medium">清单为空</div>
              <div className="text-sm text-[var(--ink-5)] mt-1">在器材超市选择需要租用的设备</div>
            </div>
          ) : (
            items.map(i => (
              <div key={i.equipmentId} className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--border)] flex items-center justify-center text-xl shrink-0">
                  {catIcon(i.eq.cat)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--ink)] leading-tight">{i.eq.name}</div>
                  <div className="text-xs text-[var(--ink-4)] mt-0.5">{fmtCNY(i.eq.day)}/天 × {days}天</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--accent)]">{fmtCNY(i.eq.day * days)}</div>
                  <button
                    onClick={() => removeFromCart(i.equipmentId)}
                    className="text-[10px] text-[var(--ink-5)] hover:text-red-500 transition-colors mt-1"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-5 space-y-4 shrink-0">
            {/* days selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--ink-3)] w-12">租期</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--border)] transition-colors"
                >−</button>
                <span className="w-8 text-center font-mono font-semibold">{days}</span>
                <button
                  onClick={() => setDays(days + 1)}
                  className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--border)] transition-colors"
                >+</button>
              </div>
              <span className="text-sm text-[var(--ink-5)]">天</span>
            </div>

            {/* project name */}
            <div>
              <input
                type="text"
                value={proj}
                onChange={e => setProj(e.target.value)}
                placeholder="项目名称（必填）"
                className="w-full h-10 px-3 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] bg-white text-[var(--ink)] placeholder:text-[var(--ink-5)]"
              />
            </div>

            {/* total */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--ink-4)]">预计费用（不含押金）</span>
              <span className="font-bold text-[var(--ink)] text-base">{fmtCNY(total)}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors font-medium"
              >
                清空
              </button>
              <button
                onClick={handleSubmit}
                disabled={!proj}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  proj
                    ? 'bg-[var(--accent)] text-white hover:bg-[#2347a3]'
                    : 'bg-[var(--border)] text-[var(--ink-5)] cursor-not-allowed'
                }`}
              >
                提交租用申请
              </button>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  )
}

function catIcon(cat: string): string {
  const map: Record<string, string> = {
    cinema: '🎬', lens: '🔭', light: '💡', monitor: '🖥',
    support: '🎚', audio: '🎙', fpv: '🚁', drone: '🛸', accessory: '🔧',
  }
  return map[cat] ?? '📦'
}
