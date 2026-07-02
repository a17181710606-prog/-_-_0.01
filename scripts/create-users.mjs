#!/usr/bin/env node
/**
 * 批量创建内部成员账号（本地 PostgreSQL 版）。
 *
 * 用法：
 *   1) 确保 .env.local 里有 DATABASE_URL
 *   2) 编辑下方 MEMBERS 名单
 *   3) 运行：node scripts/create-users.mjs
 *
 * 说明：密码用 bcrypt 哈希后入库（绝不存明文）。重复运行只更新姓名、
 *      不会覆盖已有密码（避免误重置成员已改过的密码）。
 */
import { readFileSync } from 'node:fs'
import pg from 'pg'
import bcrypt from 'bcryptjs'

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
if (!env.DATABASE_URL) {
  console.error('✗ 缺少 DATABASE_URL，请检查 .env.local')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 2 })

for (const m of MEMBERS) {
  try {
    const { rows } = await pool.query(
      `insert into users (email, name, password_hash) values ($1, $2, $3)
       on conflict (email) do update set name = excluded.name
       returning (xmax = 0) as inserted`,
      [m.email.toLowerCase(), m.name, bcrypt.hashSync(m.password, 10)],
    )
    console.log(rows[0].inserted ? `✓ 已创建：${m.email}  (${m.name})` : `• 已存在（仅更新姓名，密码未动）：${m.email}`)
  } catch (e) {
    console.error(`✗ 失败 ${m.email}：${e.message}`)
  }
}

await pool.end()
console.log('\n完成。请把邮箱与初始密码分发给对应成员，并提醒尽快改密。')
