'use client'
import Header from '@/components/layout/Header'
import StatCards from '@/components/dashboard/StatCards'
import StatusDistribution from '@/components/dashboard/StatusDistribution'
import CategoryBars from '@/components/dashboard/CategoryBars'
import RecentMovements from '@/components/dashboard/RecentMovements'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')

  return (
    <>
      <Header />
      <main className="flex-1 w-full mx-auto" style={{ maxWidth: '1320px', padding: '26px 22px 60px' }}>
        <div style={{ marginBottom: '22px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>库存总览</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#76746E' }}>设备台账实时概览 · 截至 <span className="font-mono">{today}</span></p>
        </div>

        <StatCards />

        <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '18px', marginBottom: '18px' }}>
          <StatusDistribution />
          <CategoryBars />
        </div>

        <RecentMovements />
      </main>

      <CartPanel />
      <Toast />
    </>
  )
}
