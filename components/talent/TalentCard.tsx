'use client'
import { useStore } from '@/lib/store'
import type { Talent } from '@/lib/types'

interface Props { item: Talent }

export default function TalentCard({ item }: Props) {
  const openTalent = useStore(s => s.openTalent)
  const mix = (pct: number) => `color-mix(in oklch, ${item.color} ${pct}%, white)`
  const signature = item.projects[0]?.name ?? ''

  return (
    <div
      onClick={() => openTalent(item.id)}
      className="flex flex-col bg-white cursor-pointer transition-all duration-150 hover:border-[#CFCEC8] hover:shadow-[0_10px_28px_rgba(20,20,18,0.08)] hover:-translate-y-0.5"
      style={{ gap: '13px', border: '1px solid #E9E8E4', borderRadius: '14px', padding: '17px' }}
    >
      {/* head: avatar + name + role pill */}
      <div className="flex items-center" style={{ gap: '13px' }}>
        <div
          className="flex items-center justify-center text-white shrink-0"
          style={{ width: '54px', height: '54px', borderRadius: '999px', background: item.color, fontSize: '20px', fontWeight: 600 }}
        >
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C1B19' }}>{item.name}</div>
          <div className="flex items-center" style={{ gap: '7px', marginTop: '5px' }}>
            <span
              className="whitespace-nowrap"
              style={{ fontSize: '11.5px', padding: '3px 10px', borderRadius: '999px', background: mix(12), color: item.color, border: `1px solid ${mix(26)}` }}
            >
              {item.role}
            </span>
          </div>
        </div>
      </div>

      {/* specialty */}
      <div style={{ fontSize: '12.5px', color: '#76746E', lineHeight: 1.5 }}>{item.specialty}</div>

      {/* top skills */}
      <div className="flex flex-wrap" style={{ gap: '6px' }}>
        {item.skills.slice(0, 3).map((sk, i) => (
          <span key={i} style={{ fontSize: '11.5px', color: '#44423D', background: '#F4F3F0', padding: '4px 9px', borderRadius: '6px' }}>{sk}</span>
        ))}
      </div>

      {/* footer: signature project + years */}
      <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #F2F1ED', gap: '8px' }}>
        <div className="min-w-0">
          <div style={{ fontSize: '10.5px', color: '#A6A49C', marginBottom: '1px' }}>代表项目</div>
          <div style={{ fontSize: '12px', color: '#44423D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{signature}</div>
        </div>
        <span className="font-mono shrink-0" style={{ fontSize: '11px', color: '#9C9A93' }}>{item.years} 年经验</span>
      </div>
    </div>
  )
}
