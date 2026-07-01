'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hydrated } = useAuth()

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [hydrated, user, pathname, router])

  // 等待读取本地登录态 / 未登录跳转期间，先不渲染后台内容
  if (!hydrated || !user) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '100vh', width: '100%', color: '#9C9A93', fontSize: '13px' }}
      >
        正在验证登录状态…
      </div>
    )
  }

  return <>{children}</>
}
