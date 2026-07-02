'use client'
import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: AuthUser | null
  hydrated: boolean          // 是否已完成会话初始化（避免登录态未知时误跳转）
  configured: boolean        // 是否已启用数据库后端
  init: () => void
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
}

const configured = process.env.NEXT_PUBLIC_ENABLE_DB === '1'

let initialized = false

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  configured,

  init: () => {
    if (initialized) return
    initialized = true
    if (!configured) { set({ hydrated: true }); return }
    fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' })
      .then(res => res.json())
      .then((data: { user: AuthUser | null }) => set({ user: data.user, hydrated: true }))
      .catch(() => set({ hydrated: true })) // 网络失败也要放行路由，按未登录处理
  },

  signIn: async (email, password) => {
    if (!configured) return { ok: false, error: '尚未配置数据库，无法登录（请检查 .env.local）' }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!res.ok) {
        if (res.status === 401) return { ok: false, error: '邮箱或密码错误' }
        if (res.status === 429) return { ok: false, error: '尝试过于频繁，请稍后再试' }
        const body = await res.json().catch(() => null) as { error?: string } | null
        return { ok: false, error: body?.error || '登录失败，请重试' }
      }
      const data = await res.json() as { user: AuthUser }
      set({ user: data.user })
      return { ok: true }
    } catch {
      return { ok: false, error: '网络异常，登录失败，请重试' }
    }
  },

  signOut: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } catch { /* 登出请求失败也照常清除本地状态 */ }
    set({ user: null })
  },
}))
