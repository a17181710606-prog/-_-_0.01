#!/usr/bin/env node
/**
 * 批量创建 Supabase 内部成员账号（约 5 人）。
 *
 * 用法：
 *   1) 确保 .env.local 里有 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY
 *   2) 编辑下方 MEMBERS 列表
 *   3) 运行：node scripts/create-users.mjs
 *
 * 说明：使用 service_role 密钥创建用户并直接标记邮箱已确认（email_confirm: true），
 *      成员用邮箱 + 初始密码即可登录，登录后可在应用外自行改密（如需）。
 *      service_role 密钥拥有完全权限，切勿提交到仓库或暴露到前端。
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// —— 在这里维护内部成员名单 ——
const MEMBERS = [
  { email: 'member1@company.com', password: 'ChangeMe#2026', name: '成员一' },
  { email: 'member2@company.com', password: 'ChangeMe#2026', name: '成员二' },
  { email: 'member3@company.com', password: 'ChangeMe#2026', name: '成员三' },
  { email: 'member4@company.com', password: 'ChangeMe#2026', name: '成员四' },
  { email: 'member5@company.com', password: 'ChangeMe#2026', name: '成员五' },
]

function loadEnv() {
  const env = { ...process.env }
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
  return env
}

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('✗ 缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY，请检查 .env.local')
  process.exit(1)
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

for (const m of MEMBERS) {
  const { error } = await admin.auth.admin.createUser({
    email: m.email,
    password: m.password,
    email_confirm: true,
    user_metadata: { name: m.name },
  })
  if (error) {
    if (/already been registered/i.test(error.message)) {
      console.log(`• 跳过（已存在）：${m.email}`)
    } else {
      console.error(`✗ 失败 ${m.email}：${error.message}`)
    }
  } else {
    console.log(`✓ 已创建：${m.email}  (${m.name})`)
  }
}

console.log('\n完成。请把邮箱与初始密码分发给对应成员，并提醒尽快改密。')
