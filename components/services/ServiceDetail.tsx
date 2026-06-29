'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { domainOf } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import SlideOver from '@/components/ui/SlideOver'

export default function ServiceDetail() {
  const { services, selectedServiceId, closeService, addInquiry, talent } = useStore(s => ({
    services: s.services,
    selectedServiceId: s.selectedServiceId,
    closeService: s.closeService,
    addInquiry: s.addInquiry,
    talent: s.talent,
  }))

  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const item = services.find(s => s.id === selectedServiceId)
  const domain = item ? domainOf(item.domain) : null

  const handleInquiry = () => {
    if (!contact || !item) return
    addInquiry(item.id, contact)
    setContact('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <SlideOver
      open={!!selectedServiceId}
      onClose={closeService}
      width="w-[560px]"
      title={item?.name}
    >
      {item && domain && (
        <div className="p-6 space-y-6">
          {/* domain header */}
          <div className="rounded-2xl p-5" style={{ background: domain.color + '12' }}>
            <div className="text-[11px] font-bold tracking-widest mb-1" style={{ color: domain.color }}>{domain.en}</div>
            <div className="text-2xl font-bold text-[var(--ink)]">{item.name}</div>
            <div className="text-sm text-[var(--ink-4)] mt-1">{item.tagline}</div>
            <div className="flex gap-6 mt-4">
              <Stat label="起价" value={fmtCNY(item.priceFrom) + ' ' + item.unit} />
              <Stat label="周期" value={item.duration} />
              <Stat label="配备" value={`${item.crew} 人团队`} />
            </div>
          </div>

          {/* description */}
          <div className="text-sm text-[var(--ink-3)] leading-relaxed">{item.desc}</div>

          {/* capabilities */}
          {item.caps.length > 0 && (
            <Section title="服务能力">
              <div className="flex flex-wrap gap-2">
                {item.caps.map((c, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* hardware */}
          {item.hw.length > 0 && (
            <Section title="核心设备">
              <div className="space-y-2">
                {item.hw.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-medium text-[var(--ink-2)] shrink-0">{h.label}</span>
                    <span className="text-[var(--ink-4)]">{h.detail}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* deliverables */}
          {item.deliver.length > 0 && (
            <Section title="交付物">
              <div className="space-y-1.5">
                {item.deliver.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--ink-2)]">
                    <span className="text-[var(--accent)] mt-0.5 shrink-0">✓</span>
                    {d}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* team */}
          {item.talent.length > 0 && (
            <Section title="配套团队">
              <div className="flex flex-wrap gap-2">
                {item.talent.map(tid => {
                  const t = talent.find(p => p.id === tid)
                  if (!t) return null
                  return (
                    <div key={tid} className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-3 py-1.5">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ background: t.color }}
                      >{t.initials}</span>
                      <span className="text-xs font-medium text-[var(--ink-2)]">{t.name}</span>
                    </div>
                  )
                })}
              </div>
            </Section>
          )}

          {/* inquiry form */}
          <div className="bg-[var(--border)] rounded-2xl p-4 space-y-3">
            <div className="text-sm font-semibold text-[var(--ink)]">发起咨询</div>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="您的姓名 / 公司"
              className="w-full h-10 px-3 text-sm rounded-xl border border-[var(--border-2)] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)] placeholder:text-[var(--ink-5)]"
            />
            <button
              onClick={handleInquiry}
              disabled={!contact}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                contact
                  ? 'text-white hover:opacity-90'
                  : 'bg-[var(--border-2)] text-[var(--ink-5)] cursor-not-allowed'
              }`}
              style={contact ? { background: domain.color } : {}}
            >
              {submitted ? '✓ 咨询已提交' : '提交咨询'}
            </button>
          </div>
        </div>
      )}
    </SlideOver>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[var(--ink-5)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--ink)]">{value}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-[var(--ink-5)] uppercase tracking-wide mb-2">{title}</div>
      {children}
    </div>
  )
}
