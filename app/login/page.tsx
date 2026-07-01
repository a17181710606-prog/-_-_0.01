'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/admin'
  const { user, hydrated, configured, signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 已登录则直接跳转
  useEffect(() => {
    if (hydrated && user) router.replace(redirect)
  }, [hydrated, user, redirect, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!email || !password) { setErr('请输入邮箱和密码'); return }
    setSubmitting(true)
    const res = await signIn(email, password)
    if (res.ok) {
      router.replace(redirect)
    } else {
      setErr(res.error || '登录失败')
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100vh', background: '#F4F3F0', padding: '24px' }}
    >
      <div
        style={{ width: '100%', maxWidth: '384px', background: '#fff', border: '1px solid #E6E5E1', borderRadius: '16px', padding: '32px 30px 28px', boxShadow: '0 8px 30px rgba(28,27,25,0.06)' }}
      >
        {/* brand */}
        <div className="flex items-center" style={{ gap: '11px', marginBottom: '24px' }}>
          <Image src="/assets/logo.png" alt="景彩文化" width={34} height={34} style={{ height: '34px', width: 'auto' }} />
          <div className="flex flex-col" style={{ lineHeight: 1.15 }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1B19' }}>景彩文化</span>
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.16em', color: '#A6A49C' }}>后台管理 · ADMIN LOGIN</span>
          </div>
        </div>

        <h1 style={{ margin: '0 0 4px', fontSize: '19px', fontWeight: 700, color: '#1C1B19' }}>登录后台</h1>
        <p style={{ margin: '0 0 22px', fontSize: '12.5px', color: '#9C9A93' }}>请使用公司分配的邮箱账号登录器材管理后台</p>

        {!configured && (
          <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.09 60)', background: 'oklch(0.96 0.04 80)', padding: '10px 12px', borderRadius: '9px', marginBottom: '16px', lineHeight: 1.5 }}>
            ⚠️ 尚未配置 Supabase 环境变量，暂时无法登录。请在 <span className="font-mono">.env.local</span> 中填入项目 URL 与 anon key。
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col" style={{ gap: '14px' }}>
          <label className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#76746E' }}>邮箱</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="username"
              placeholder="name@company.com"
              className="w-full focus:outline-none focus:ring-1 focus:ring-[#2F5AC7] focus:!border-[#2F5AC7]"
              style={{ height: '42px', padding: '0 13px', border: '1px solid #E4E3DE', borderRadius: '10px', background: '#fff', fontSize: '13.5px', color: '#1C1B19' }}
            />
          </label>

          <label className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#76746E' }}>密码</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="请输入密码"
              className="w-full focus:outline-none focus:ring-1 focus:ring-[#2F5AC7] focus:!border-[#2F5AC7]"
              style={{ height: '42px', padding: '0 13px', border: '1px solid #E4E3DE', borderRadius: '10px', background: '#fff', fontSize: '13.5px', color: '#1C1B19' }}
            />
          </label>

          {err && (
            <div style={{ fontSize: '12.5px', color: 'oklch(0.58 0.19 27)', background: 'color-mix(in oklch, oklch(0.58 0.19 27) 8%, white)', padding: '9px 12px', borderRadius: '9px' }}>
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ height: '44px', marginTop: '4px', borderRadius: '11px', background: '#1C1B19', color: '#fff', fontSize: '14px', fontWeight: 600 }}
          >
            {submitting ? '登录中…' : '登 录'}
          </button>
        </form>

        <div className="flex items-center justify-between" style={{ marginTop: '18px' }}>
          <Link href="/catalog" style={{ fontSize: '12.5px', color: '#76746E' }} className="hover:!text-[#1C1B19]">
            ← 返回前台超市
          </Link>
          <span style={{ fontSize: '11px', color: '#C4C2BB' }}>内部账号 · 由管理员分配</span>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
