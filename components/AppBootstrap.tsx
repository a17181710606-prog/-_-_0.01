'use client'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useStore } from '@/lib/store'

// 应用启动引导：初始化 Supabase 会话监听 + 拉取后端设备/记录数据。
// 挂载在根布局，全站（前台超市 + 后台）共享同一份数据源。
export default function AppBootstrap() {
  useEffect(() => {
    useAuth.getState().init()
    useStore.getState().hydrate()
  }, [])
  return null
}
