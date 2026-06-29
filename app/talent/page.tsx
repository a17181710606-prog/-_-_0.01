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
  const roles = [{ id: 'all' as const, label: '全部人员' }, ...ROLES]

  return (
    <>
      <Header />
      <main className="flex-1 w-full mx-auto" style={{ maxWidth: '1440px', padding: '22px 22px 60px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>人才库</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#76746E' }}>
            具备特种技能的专业团队 · 统一档案呈现 · 共 <span className="font-mono" style={{ color: '#44423D' }}>{talent.length}</span> 位入库人员
          </p>
        </div>

        {/* role chips */}
        <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '24px' }}>
          {roles.map(r => {
            const active = filter === r.id
            return (
              <button
                key={r.id}
                onClick={() => setFilter(r.id as RoleKey | 'all')}
                className="whitespace-nowrap cursor-pointer"
                style={{
                  padding: '8px 16px', borderRadius: '999px', fontSize: '13.5px',
                  border: active ? '1px solid #1C1B19' : '1px solid #E4E3DE',
                  background: active ? '#1C1B19' : '#fff',
                  color: active ? '#fff' : '#44423D',
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(264px, 1fr))', gap: '16px' }}>
          {filtered.map(t => <TalentCard key={t.id} item={t} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#9C9A93', fontSize: '14px' }}>该角色暂无人才</div>
        )}
      </main>

      <TalentDetail />
      <CartPanel />
      <Toast />
    </>
  )
}
