'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { ROLES } from '@/lib/constants'
import type { RoleKey } from '@/lib/types'
import Header from '@/components/layout/Header'
import TalentCard from '@/components/talent/TalentCard'
import TalentDetail from '@/components/talent/TalentDetail'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

export default function TalentPage() {
  const talent = useStore(s => s.talent)
  const [filter, setFilter] = useState<RoleKey | 'all'>('all')

  const filtered = filter === 'all' ? talent : talent.filter(t => t.roleKey === filter)

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ink)]">人才库</h1>
          <p className="text-[var(--ink-4)] mt-2">专业影视制作团队成员</p>
        </div>

        {/* role filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <RoleBtn active={filter === 'all'} onClick={() => setFilter('all')} label="全部角色" />
          {ROLES.map(r => (
            <RoleBtn
              key={r.id}
              active={filter === r.id}
              onClick={() => setFilter(r.id as RoleKey)}
              label={r.label}
            />
          ))}
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(t => <TalentCard key={t.id} item={t} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--ink-5)]">
            <div className="text-5xl mb-3">👤</div>
            <div>该角色暂无人才</div>
          </div>
        )}
      </div>

      <TalentDetail />
      <CartPanel />
      <Toast />
    </>
  )
}

function RoleBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        active
          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
          : 'border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--border-2)] bg-white'
      }`}
    >
      {label}
    </button>
  )
}
