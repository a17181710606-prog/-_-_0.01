'use client'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import StatCards from '@/components/dashboard/StatCards'
import StatusDistribution from '@/components/dashboard/StatusDistribution'
import CategoryBars from '@/components/dashboard/CategoryBars'
import RecentMovements from '@/components/dashboard/RecentMovements'
import CartPanel from '@/components/equipment/CartPanel'
import Toast from '@/components/ui/Toast'

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)]">库存总览</h1>
            <p className="text-sm text-[var(--ink-4)] mt-1">实时器材资产状态</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors font-medium"
          >
            进入管理后台 →
          </Link>
        </div>

        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusDistribution />
          <CategoryBars />
        </div>

        <RecentMovements />
      </div>

      <CartPanel />
      <Toast />
    </>
  )
}
