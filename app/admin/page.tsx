'use client'
import Link from 'next/link'
import StatCards from '@/components/dashboard/StatCards'
import StatusDistribution from '@/components/dashboard/StatusDistribution'
import CategoryBars from '@/components/dashboard/CategoryBars'
import RecentMovements from '@/components/dashboard/RecentMovements'

export default function AdminHomePage() {
  return (
    <div className="overflow-y-auto h-full p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)]">总览</h1>
          <p className="text-xs text-[var(--ink-5)] mt-0.5">器材资产实时状态</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/devices"
            className="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[#2347a3] transition-colors"
          >
            管理设备
          </Link>
          <Link
            href="/admin/records"
            className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg font-medium text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors"
          >
            出入库记录
          </Link>
        </div>
      </div>

      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusDistribution />
        <CategoryBars />
      </div>
      <RecentMovements />
    </div>
  )
}
