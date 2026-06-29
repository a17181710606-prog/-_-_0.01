'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'

const NAV = [
  { href: '/catalog',   label: '器材超市' },
  { href: '/services',  label: '服务超市' },
  { href: '/talent',    label: '人才库' },
  { href: '/dashboard', label: '库存总览' },
]

export default function Header() {
  const pathname = usePathname()
  const { cart, setCartOpen, searchQ, setSearchQ } = useStore(s => ({
    cart: s.cart,
    setCartOpen: s.setCartOpen,
    searchQ: s.searchQ,
    setSearchQ: s.setSearchQ,
  }))

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  if (pathname.startsWith('/admin')) return null

  return (
    <header
      className="sticky top-0 z-40 flex items-center"
      style={{ background: 'rgba(250,250,248,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E9E8E4', padding: '0 22px', height: '62px', gap: '18px' }}
    >
      {/* logo */}
      <Link href="/catalog" className="flex items-center shrink-0" style={{ gap: '10px' }}>
        <Image src="/assets/logo.png" alt="景彩文化" width={30} height={30} style={{ height: '30px', width: 'auto' }} />
        <div className="flex flex-col" style={{ lineHeight: 1.12 }}>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', color: '#1C1B19' }}>景彩文化</span>
          <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#A6A49C' }}>器材超市 · EQUIPMENT</span>
        </div>
      </Link>

      {/* nav */}
      <nav className="flex items-center" style={{ gap: '4px', marginLeft: '8px' }}>
        {NAV.map(n => {
          const active = pathname === n.href || pathname.startsWith(n.href + '/')
          return (
            <Link
              key={n.href}
              href={n.href}
              className="transition-colors"
              style={{
                height: '34px', padding: '0 13px', borderRadius: '9px', fontSize: '13px',
                display: 'flex', alignItems: 'center',
                background: active ? '#1C1B19' : 'transparent',
                color: active ? '#fff' : '#44423D',
                fontWeight: active ? 600 : 400,
              }}
            >
              {n.label}
            </Link>
          )
        })}
      </nav>

      {/* search */}
      <div className="flex-1 flex justify-center min-w-0">
        <div className="relative w-full" style={{ maxWidth: '420px' }}>
          <span className="absolute flex" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A6A49C' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="7" cy="7" r="5" />
              <line x1="11" y1="11" x2="14.5" y2="14.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="搜索设备、型号、品牌、编号…"
            className="w-full focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]"
            style={{ height: '38px', padding: '0 14px 0 34px', border: '1px solid #E4E3DE', borderRadius: '10px', background: '#fff', fontSize: '13px', color: '#1C1B19' }}
          />
        </div>
      </div>

      {/* cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="flex items-center cursor-pointer transition-colors"
        style={{ height: '34px', padding: '0 13px', borderRadius: '9px', border: '1px solid #E4E3DE', background: '#fff', fontSize: '13px', color: '#44423D', gap: '6px' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="3" y="2.5" width="10" height="12" rx="1.6" />
          <line x1="5.6" y1="6" x2="10.4" y2="6" strokeLinecap="round" />
          <line x1="5.6" y1="8.6" x2="10.4" y2="8.6" strokeLinecap="round" />
          <line x1="5.6" y1="11.2" x2="8.6" y2="11.2" strokeLinecap="round" />
        </svg>
        <span>我的清单</span>
        {cartCount > 0 && (
          <span
            className="font-mono flex items-center justify-center"
            style={{ minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '999px', background: '#2F5AC7', color: '#fff', fontSize: '11px', fontWeight: 600 }}
          >
            {cartCount}
          </span>
        )}
      </button>

      <div style={{ width: '1px', height: '22px', background: '#E4E3DE', margin: '0 2px' }} />

      {/* admin */}
      <Link
        href="/admin"
        className="flex items-center cursor-pointer transition-colors hover:!bg-[#1C1B19] hover:!text-white hover:!border-[#1C1B19]"
        style={{ height: '34px', padding: '0 13px', borderRadius: '9px', border: '1px solid #E4E3DE', background: '#fff', fontSize: '13px', color: '#44423D', gap: '6px' }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="2.5" y="3" width="11" height="8" rx="1.2" />
          <line x1="6" y1="13.6" x2="10" y2="13.6" strokeLinecap="round" />
          <line x1="8" y1="11" x2="8" y2="13.6" />
        </svg>
        后台管理
      </Link>
    </header>
  )
}
