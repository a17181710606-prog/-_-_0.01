'use client'
import { useStore } from '@/lib/store'
import { domainOf } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { Service } from '@/lib/types'

interface Props { item: Service }

export default function ServiceCard({ item }: Props) {
  const openService = useStore(s => s.openService)
  const domain = domainOf(item.domain)

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      onClick={() => openService(item.id)}
    >
      {/* domain band */}
      <div className="h-1.5" style={{ background: domain.color }} />

      <div className="p-5">
        {/* domain tag */}
        <span
          className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
          style={{ background: domain.color + '18', color: domain.color }}
        >
          {domain.en}
        </span>

        <h3 className="mt-2 font-bold text-base text-[var(--ink)] leading-tight">{item.name}</h3>
        <p className="text-xs text-[var(--ink-4)] mt-1 line-clamp-2">{item.tagline}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <div className="text-[10px] text-[var(--ink-5)]">起价</div>
            <div className="font-bold text-[var(--accent)] text-lg">{fmtCNY(item.priceFrom)}</div>
            <div className="text-[10px] text-[var(--ink-5)]">{item.unit}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[var(--ink-5)]">标准周期</div>
            <div className="text-xs font-medium text-[var(--ink-3)] mt-0.5">{item.duration}</div>
            <div className="text-[10px] text-[var(--ink-5)]">配备 {item.crew} 人</div>
          </div>
        </div>
      </div>
    </div>
  )
}
