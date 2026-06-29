'use client'
import { useStore } from '@/lib/store'
import type { Talent } from '@/lib/types'

interface Props { item: Talent }

export default function TalentCard({ item }: Props) {
  const openTalent = useStore(s => s.openTalent)
  return (
    <div
      className="bg-white rounded-2xl border border-[var(--border)] p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
      onClick={() => openTalent(item.id)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: item.color }}
        >
          {item.initials}
        </div>
        <div>
          <div className="font-semibold text-[var(--ink)]">{item.name}</div>
          <div className="text-xs text-[var(--ink-4)]">{item.role}</div>
          <div className="text-[11px] text-[var(--ink-5)]">{item.years} 年经验</div>
        </div>
      </div>
      <div className="text-xs text-[var(--ink-3)] line-clamp-2 mb-3">{item.specialty}</div>
      <div className="flex flex-wrap gap-1">
        {item.skills.slice(0, 3).map((s, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--ink-4)]">{s}</span>
        ))}
        {item.skills.length > 3 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--ink-5)]">+{item.skills.length - 3}</span>
        )}
      </div>
    </div>
  )
}
