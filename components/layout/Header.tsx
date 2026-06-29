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
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)] h-14 flex items-center px-5 gap-4">
      {/* logo */}
      <Link href="/catalog" className="flex items-center gap-2.5 shrink-0">
        <Image src="/assets/logo.png" alt="景彩文化" width={28} height={28} className="rounded" />
        <span className="font-semibold text-[var(--ink)] text-sm tracking-tight hidden sm:block">景彩文化</span>
        <span className="text-[var(--ink-5)] text-xs hidden sm:block">器材超市</span>
      </Link>

      {/* nav */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV.map(n => {
          const active = pathname === n.href || pathname.startsWith(n.href + '/')
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-[var(--accent-sel)] text-[var(--accent)]'
                  : 'text-[var(--ink-3)] hover:bg-[var(--border)] hover:text-[var(--ink)]'
              }`}
            >
              {n.label}
            </Link>
          )
        })}
      </nav>

      {/* search */}
      <div className="relative hidden md:block w-48">
        <input
          type="text"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="搜索器材…"
          className="w-full h-8 pl-8 pr-3 text-sm bg-[var(--border)] rounded-full border-0 text-[var(--ink)] placeholder:text-[var(--ink-5)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="relative p-2 rounded-lg text-[var(--ink-3)] hover:bg-[var(--border)] hover:text-[var(--ink)] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* admin */}
      <Link
        href="/admin"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--border)] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        后台
      </Link>
    </header>
  )
}
