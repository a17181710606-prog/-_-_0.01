'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const LINKS = [
  { href: '/admin', label: '工作台' },
  { href: '/admin/devices', label: '设备管理' },
  { href: '/admin/records', label: '出入库记录' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside
      className="shrink-0 flex flex-col sticky top-0"
      style={{ width: '216px', background: '#191A1E', color: '#E8E7E3', height: '100vh' }}
    >
      {/* header */}
      <div className="flex items-center" style={{ padding: '18px 18px 15px', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Image src="/assets/logo.png" alt="景彩文化" width={26} height={26} style={{ height: '26px', width: 'auto' }} />
        <div className="flex flex-col" style={{ lineHeight: 1.18 }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff' }}>景彩文化</span>
          <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.14em', color: '#7C7A74' }}>后台管理 ADMIN</span>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 flex flex-col" style={{ padding: '14px 12px', gap: '3px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#67655F', padding: '2px 11px 8px' }}>运营</div>
        {LINKS.map(l => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '9px', width: '100%', padding: '9px 11px',
                borderRadius: '8px', fontSize: '13.5px',
                background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: active ? '#fff' : '#A8A6A0',
                fontWeight: active ? 600 : 400,
              }}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>

      {/* back to storefront */}
      <div style={{ padding: '13px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href="/catalog"
          className="flex items-center transition-colors hover:!bg-[rgba(255,255,255,0.12)]"
          style={{ gap: '8px', width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#C9C7C1', fontSize: '13px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8.5 3L4.5 7L8.5 11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回前台超市
        </Link>
      </div>
    </aside>
  )
}
