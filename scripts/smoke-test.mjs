#!/usr/bin/env node
/**
 * 前后端连通性冒烟测试（HTTP 版，打本项目 /api 路由）。
 *
 * 覆盖：
 *   1) 匿名可读 equipment（前台超市依赖）
 *   2) 匿名【不可】写 equipment（401，复刻原 RLS）
 *   3) 成员登录拿 cookie（后台管理依赖）
 *   4) 登录后设备 增 → 查 → 删
 *   5) 出入库记录 写 + 清理
 *   6) 登出后再写 → 401
 *
 * 用法：node scripts/smoke-test.mjs [baseURL]
 *   默认 http://localhost:3000；生产：node scripts/smoke-test.mjs http://47.96.108.103
 */
import { readFileSync } from 'node:fs'

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
const BASE = process.argv[2] || env.SMOKE_BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = env.SMOKE_EMAIL || 'member1@company.com'
const TEST_PASSWORD = env.SMOKE_PASSWORD || 'ChangeMe#2026'

let cookie = '' // Node fetch 不自动保存 cookie，手动透传
let pass = 0, fail = 0
const ok = (m) => { console.log(`  ✓ ${m}`); pass++ }
const no = (m) => { console.log(`  ✗ ${m}`); fail++ }

async function call(method, path, body) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) cookie = setCookie.split(';')[0]
  let json = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}

console.log(`\n目标：${BASE}\n`)

console.log('[1] 匿名读取 equipment')
{
  const { status } = await call('GET', '/equipment')
  status === 200 ? ok('匿名可读 equipment (200)') : no(`匿名读取失败 (${status})`)
}

console.log('[2] 匿名写入应被拒绝')
{
  const { status } = await call('POST', '/equipment', { rows: [{ name: '__anon__', cat: 'accessory' }] })
  status === 401 ? ok('匿名写入被拒绝 (401)') : no(`预期 401，实际 ${status} —— 鉴权未生效！`)
}

console.log(`[3] 成员登录：${TEST_EMAIL}`)
let signedIn = false
{
  const { status, json } = await call('POST', '/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD })
  if (status === 200 && cookie) { ok(`登录成功，拿到会话 cookie（${json?.user?.name ?? ''}）`); signedIn = true }
  else no(`登录失败 (${status}) ${json?.error ?? ''}（是否已运行 create-users.mjs？）`)
}

if (signedIn) {
  console.log('[4] 登录后 设备增/查/删')
  let newId = null
  {
    const { status, json } = await call('POST', '/equipment', {
      rows: [{ name: '__smoke_test_device__', brand: 'TEST', cat: 'accessory', st: 'in', av: 1, tot: 1 }],
    })
    if (status === 200 && json?.rows?.[0]?.id) { newId = json.rows[0].id; ok(`插入设备 id=${newId}`) }
    else no(`插入失败 (${status}) ${json?.error ?? ''}`)
  }
  if (newId) {
    const { json } = await call('GET', '/equipment')
    const found = json?.rows?.find(r => r.id === newId)
    found?.name === '__smoke_test_device__' ? ok('读回成功') : no('读回失败')
    const { status: delSt } = await call('DELETE', '/equipment', { ids: [newId] })
    delSt === 200 ? ok('删除清理成功') : no(`清理失败 (${delSt})`)
  }

  console.log('[5] 出入库记录写入 + 清理')
  {
    const rec = { id: `SMOKE-${Date.now()}`, t: '2026-01-01 00:00', dev: '__smoke__', op: '出库', by: '测试', proj: '' }
    const { status } = await call('POST', '/movements', rec)
    if (status === 200) {
      ok('记录写入成功')
      const { status: delSt } = await call('DELETE', '/movements', { ids: [rec.id] })
      delSt === 200 ? ok('记录清理成功') : no(`记录清理失败 (${delSt})`)
    } else no(`记录写入失败 (${status})`)
  }

  console.log('[6] 登出后写入应被拒绝')
  {
    await call('POST', '/auth/logout')
    const { status } = await call('POST', '/equipment', { rows: [{ name: '__after_logout__', cat: 'accessory' }] })
    status === 401 ? ok('登出后写入被拒绝 (401)') : no(`预期 401，实际 ${status}`)
  }
}

console.log(`\n结果：${pass} 通过 / ${fail} 失败`)
process.exit(fail === 0 ? 0 : 1)
