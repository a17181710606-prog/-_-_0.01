'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { DOMAINS } from '@/lib/constants'
import type { DomainKey } from '@/lib/types'
import Header from '@/components/layout/Header'
import ServiceCard from '@/components/services/ServiceCard'
import ServiceDetail from '@/components/services/ServiceDetail'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

export default function ServicesPage() {
  const services = useStore(s => s.services)
  const [filter, setFilter] = useState<DomainKey | 'all'>('all')

  const filtered = filter === 'all' ? services : services.filter(s => s.domain === filter)
  const domains = [{ id: 'all' as const, label: '全部领域' }, ...DOMAINS.map(d => ({ id: d.id, label: d.label }))]

  return (
    <>
      <Header />
      <main className="flex-1 w-full mx-auto" style={{ maxWidth: '1440px', padding: '22px 22px 60px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>服务超市</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#76746E' }}>
            按拍摄领域选服务包 · 每个包整合 <span style={{ color: '#44423D' }}>硬件资源 + 服务团队 + 拍摄能力</span> · 共 <span className="font-mono" style={{ color: '#44423D' }}>{services.length}</span> 个服务包
          </p>
        </div>

        {/* domain chips */}
        <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '24px' }}>
          {domains.map(d => {
            const active = filter === d.id
            return (
              <button
                key={d.id}
                onClick={() => setFilter(d.id as DomainKey | 'all')}
                className="whitespace-nowrap cursor-pointer"
                style={{
                  padding: '8px 16px', borderRadius: '999px', fontSize: '13.5px',
                  border: active ? '1px solid #1C1B19' : '1px solid #E4E3DE',
                  background: active ? '#1C1B19' : '#fff',
                  color: active ? '#fff' : '#44423D',
                }}
              >
                {d.label}
              </button>
            )
          })}
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(326px, 1fr))', gap: '18px' }}>
          {filtered.map(s => <ServiceCard key={s.id} item={s} />)}
        </div>
      </main>

      <ServiceDetail />
      <CartPanel />
      <Toast />
    </>
  )
}
