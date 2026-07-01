'use client'
import { create } from 'zustand'
import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: AuthUser | null
  hydrated: boolean          // 是否已完成会话初始化（避免登录态未知时误跳转）
  configured: boolean        // 是否已配置 Supabase
  init: () => void
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
}

function mapUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null | undefined): AuthUser | null {
  if (!u) return null
  const meta = u.user_metadata ?? {}
  const name = (meta.name as string) || (meta.full_name as string) || (u.email ? u.email.split('@')[0] : '成员')
  return { id: u.id, email: u.email ?? '', name }
}

function mapError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return '邮箱或密码错误'
  if (/Email not confirmed/i.test(msg)) return '该账号邮箱未确认，请在 Supabase 后台确认后再登录'
  if (/rate limit/i.test(msg)) return '尝试过于频繁，请稍后再试'
  return msg || '登录失败，请重试'
}

let initialized = false

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  configured: supabase !== null,

  init: () => {
    if (initialized) return
    initialized = true
    if (!supabase) { set({ hydrated: true }); return }
    supabase.auth.getSession().then(({ data }) => {
      set({ user: mapUser(data.session?.user), hydrated: true })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: mapUser(session?.user ?? null) })
    })
  },

  signIn: async (email, password) => {
    if (!supabase) return { ok: false, error: '尚未配置 Supabase，无法登录（请检查 .env.local）' }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) return { ok: false, error: mapError(error.message) }
    set({ user: mapUser(data.user) })
    return { ok: true }
  },

  signOut: async () => {
    if (supabase) await supabase.auth.signOut()
    set({ user: null })
  },
}))
