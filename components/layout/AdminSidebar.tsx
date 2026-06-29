'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const LINKS = [
  {
    href: '/admin',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: '总览',
  },
  {
    href: '/admin/devices',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    label: '设备管理',
  },
  {
    href: '/admin/records',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    label: '出入库记录',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-52 shrink-0 h-screen sticky top-0 bg-[#1C1B19] flex flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <Image src="/assets/logo.png" alt="景彩文化" width={28} height={28} className="rounded" />
        <div>
          <div className="text-white text-sm font-semibold">景彩文化</div>
          <div className="text-white/40 text-[11px]">管理后台</div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {LINKS.map(l => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          )
        })}
      </nav>

      {/* back to storefront */}
      <div className="p-2 border-t border-white/10">
        <Link
          href="/catalog"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回前台
        </Link>
      </div>
    </aside>
  )
}
