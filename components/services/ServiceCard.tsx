'use client'
import { useStore } from '@/lib/store'
import { domainOf } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { Service } from '@/lib/types'

interface Props { item: Service }

export default function ServiceCard({ item }: Props) {
  const { openService, talent, toast } = useStore(s => ({
    openService: s.openService,
    talent: s.talent,
    toast: s.toast,
  }))
  const dom = domainOf(item.domain)
  const leads = item.talent.map(id => talent.find(t => t.id === id)).filter(Boolean).slice(0, 4) as typeof talent

  const mix = (pct: number) => `color-mix(in oklch, ${dom.color} ${pct}%, white)`

  return (
    <div
      onClick={() => openService(item.id)}
      className="flex flex-col bg-white overflow-hidden cursor-pointer transition-all duration-150 hover:border-[#CFCEC8] hover:shadow-[0_10px_30px_rgba(20,20,18,0.09)] hover:-translate-y-0.5"
      style={{ border: '1px solid #E9E8E4', borderRadius: '14px' }}
    >
      {/* hero */}
      <div
        className="relative flex flex-col justify-between"
        style={{ aspectRatio: '16 / 9', background: mix(15), borderBottom: `1px solid ${mix(24)}`, padding: '14px 16px' }}
      >
        <span
          className="self-start"
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', padding: '4px 11px', borderRadius: '999px', background: '#fff', color: dom.color, border: `1px solid ${mix(30)}` }}
        >
          {dom.label}
        </span>
        <div>
          <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(28,27,25,0.45)', marginBottom: '5px' }}>{dom.en}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B19', letterSpacing: '-0.01em' }}>{item.name}</div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col flex-1" style={{ padding: '15px 16px 16px', gap: '13px' }}>
        <p style={{ margin: 0, fontSize: '13.5px', color: '#76746E' }}>{item.tagline}</p>

        {/* stat pills */}
        <div className="flex flex-wrap" style={{ gap: '7px' }}>
          <Pill icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="3" width="12" height="9" rx="1.2" /><line x1="2" y1="6" x2="14" y2="6" /></svg>}>硬件 {item.hw.length}</Pill>
          <Pill icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="3,8 6,11 13,4" strokeLinecap="round" strokeLinejoin="round" /></svg>}>能力 {item.caps.length}</Pill>
          <Pill icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="6" cy="6" r="2.4" /><path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4" /><path d="M11 5.5a2.2 2.2 0 010 4M14 13a3.6 3.6 0 00-2.5-3.4" /></svg>}>团队 {leads.length}</Pill>
        </div>

        {/* price + avatars */}
        <div className="flex items-end justify-between" style={{ marginTop: 'auto', paddingTop: '13px', borderTop: '1px solid #F2F1ED', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#9C9A93', marginBottom: '2px' }}>服务起价</div>
            <div className="flex items-baseline" style={{ gap: '3px' }}>
              <span className="font-mono" style={{ fontSize: '18px', fontWeight: 600, color: '#1C1B19' }}>{fmtCNY(item.priceFrom)}</span>
              <span style={{ fontSize: '11px', color: '#9C9A93' }}>/{item.unit}起</span>
            </div>
          </div>
          <div className="flex items-center">
            {leads.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-center text-white"
                style={{ width: '27px', height: '27px', borderRadius: '999px', background: t.color, fontSize: '11px', fontWeight: 600, marginLeft: i === 0 ? 0 : '-7px', border: '2px solid #fff', boxShadow: '0 0 0 .5px rgba(0,0,0,.04)' }}
              >
                {t.initials}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); toast(`已提交「${item.name}」服务意向，顾问将尽快与你联系`); }}
          className="w-full cursor-pointer transition-colors hover:!bg-[#2F5AC7]"
          style={{ height: '40px', borderRadius: '10px', border: 'none', background: '#1C1B19', color: '#fff', fontSize: '14px' }}
        >
          一键发起服务
        </button>
      </div>
    </div>
  )
}

function Pill({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center" style={{ gap: '5px', fontSize: '12px', color: '#44423D', background: '#F4F3F0', padding: '4px 10px', borderRadius: '7px' }}>
      {icon}{children}
    </span>
  )
}
