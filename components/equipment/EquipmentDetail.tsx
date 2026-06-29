'use client'
import { useStore } from '@/lib/store'
import { STATUS } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import SlideOver from '@/components/ui/SlideOver'
import Badge from '@/components/ui/Badge'

const OWN_LABEL: Record<string, string> = {
  '自有': '公司自有',
  '合作商': '合作商提供',
  '个人挂靠': '个人挂靠',
}

export default function EquipmentDetail() {
  const { equipment, selectedEquipmentId, closeEquipment, addToCart, cart } = useStore(s => ({
    equipment: s.equipment,
    selectedEquipmentId: s.selectedEquipmentId,
    closeEquipment: s.closeEquipment,
    addToCart: s.addToCart,
    cart: s.cart,
  }))

  const item = equipment.find(e => e.id === selectedEquipmentId)
  const status = item ? STATUS[item.st] : null
  const inCart = item ? cart.some(c => c.equipmentId === item.id) : false
  const canRent = item?.st === 'in'

  return (
    <SlideOver
      open={!!selectedEquipmentId}
      onClose={closeEquipment}
      width="w-[520px]"
      title={item ? item.name : ''}
    >
      {item && status && (
        <div className="p-6 space-y-6">
          {/* hero */}
          <div className="h-48 bg-gradient-to-br from-[var(--border)] to-[var(--border-2)] rounded-xl flex items-center justify-center">
            <span className="text-7xl">{catIcon(item.cat)}</span>
          </div>

          {/* meta */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--ink-5)] mb-1">{item.code}</div>
              <div className="font-semibold text-lg text-[var(--ink)]">{item.name}</div>
              <div className="text-sm text-[var(--ink-4)] mt-0.5">{item.brand} · {item.model}</div>
            </div>
            <Badge color={status.color} label={status.label} size="md" />
          </div>

          {/* pricing */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '日租金', value: fmtCNY(item.day) + '/天' },
              { label: '月租金', value: fmtCNY(item.tot) + '/月' },
              { label: '押金', value: fmtCNY(item.dep) },
            ].map(p => (
              <div key={p.label} className="bg-[var(--accent-bg)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--ink-4)] mb-1">{p.label}</div>
                <div className="font-bold text-[var(--accent)] text-sm">{p.value}</div>
              </div>
            ))}
          </div>

          {/* specs */}
          {item.specs.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--ink-5)] uppercase tracking-wide mb-2">规格参数</div>
              <div className="space-y-1.5">
                {item.specs.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--ink-2)]">
                    <span className="w-1 h-1 rounded-full bg-[var(--ink-5)] mt-2 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row label="存放位置" value={item.loc} />
            <Row label="归属" value={OWN_LABEL[item.own] ?? item.own} />
            <Row label="资产价值" value={fmtCNY(item.val)} />
            <Row label="可用数量" value={`${item.av} 件`} />
          </div>

          {/* note */}
          {item.note && (
            <div className="bg-[oklch(0.74_0.12_78_/_0.1)] rounded-lg p-3 text-sm text-[var(--ink-3)]">
              <span className="text-[var(--ink-5)] font-medium text-xs mr-2">备注</span>
              {item.note}
            </div>
          )}

          {/* action */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { if (canRent) addToCart(item.id); closeEquipment() }}
              disabled={!canRent}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                canRent
                  ? inCart
                    ? 'bg-[var(--accent-sel)] text-[var(--accent)]'
                    : 'bg-[var(--accent)] text-white hover:bg-[#2347a3]'
                  : 'bg-[var(--border)] text-[var(--ink-5)] cursor-not-allowed'
              }`}
            >
              {!canRent ? '当前不可租用' : inCart ? '已加入清单 ✓' : '加入租用清单'}
            </button>
          </div>
        </div>
      )}
    </SlideOver>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-[var(--ink-5)] mb-0.5">{label}</div>
      <div className="text-[var(--ink-2)] font-medium">{value}</div>
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
