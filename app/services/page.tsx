'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { DOMAINS } from '@/lib/constants'
import { domainOf } from '@/lib/constants'
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

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ink)]">服务超市</h1>
          <p className="text-[var(--ink-4)] mt-2">专业影视制作一站式服务解决方案</p>
        </div>

        {/* domain filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <DomainBtn active={filter === 'all'} onClick={() => setFilter('all')} color="var(--ink-3)" label="全部服务" />
          {DOMAINS.map(d => (
            <DomainBtn
              key={d.id}
              active={filter === d.id}
              onClick={() => setFilter(d.id as DomainKey)}
              color={d.color}
              label={d.label}
              en={d.en}
            />
          ))}
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => <ServiceCard key={s.id} item={s} />)}
        </div>
      </div>

      <ServiceDetail />
      <CartPanel />
      <Toast />
    </>
  )
}

function DomainBtn({ active, onClick, color, label, en }: {
  active: boolean; onClick: () => void; color: string; label: string; en?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${
        active ? 'border-transparent text-white shadow-sm' : 'border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--border-2)] bg-white'
      }`}
      style={active ? { background: color, borderColor: color } : {}}
    >
      {label}
      {en && <span className={`text-[10px] font-bold ${active ? 'text-white/70' : 'text-[var(--ink-5)]'}`}>{en}</span>}
    </button>
  )
}
