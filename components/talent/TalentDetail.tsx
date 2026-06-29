'use client'
import { useStore } from '@/lib/store'
import SlideOver from '@/components/ui/SlideOver'

export default function TalentDetail() {
  const { talent, selectedTalentId, closeTalent } = useStore(s => ({
    talent: s.talent,
    selectedTalentId: s.selectedTalentId,
    closeTalent: s.closeTalent,
  }))

  const item = talent.find(t => t.id === selectedTalentId)

  return (
    <SlideOver
      open={!!selectedTalentId}
      onClose={closeTalent}
      width="w-[500px]"
      title={item?.name}
    >
      {item && (
        <div className="p-6 space-y-6">
          {/* hero */}
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
              style={{ background: item.color }}
            >
              {item.initials}
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--ink)]">{item.name}</div>
              <div className="text-[var(--ink-4)]">{item.role}</div>
              <div className="text-sm text-[var(--ink-5)] mt-0.5">{item.years} 年从业经验</div>
            </div>
          </div>

          {/* bio */}
          <div className="text-sm text-[var(--ink-3)] leading-relaxed">{item.bio}</div>

          {/* specialty */}
          <div>
            <SectionTitle>专业方向</SectionTitle>
            <div className="text-sm text-[var(--ink-2)]">{item.specialty}</div>
          </div>

          {/* skills */}
          {item.skills.length > 0 && (
            <div>
              <SectionTitle>技能标签</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* gear */}
          {item.gear.length > 0 && (
            <div>
              <SectionTitle>常用设备</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {item.gear.map((g, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[var(--border)] text-[var(--ink-3)]">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* projects */}
          {item.projects.length > 0 && (
            <div>
              <SectionTitle>代表项目</SectionTitle>
              <div className="space-y-2">
                {item.projects.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-[var(--ink-5)] shrink-0">{p.year}</span>
                    <div>
                      <span className="font-medium text-[var(--ink-2)]">{p.name}</span>
                      <span className="text-[var(--ink-5)] ml-2 text-xs">{p.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SlideOver>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-[var(--ink-5)] uppercase tracking-wide mb-2">{children}</div>
  )
}
