import bcrypt from 'bcryptjs'
import { getPool } from '@/lib/server/db'
import { createSession } from '@/lib/server/session'
import { jsonError } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

// 用户不存在时也比对一次假哈希，避免响应时间差暴露"邮箱是否存在"
const DUMMY_HASH = bcrypt.hashSync('__dummy_password__', 10)

// 简易内存限流：每 IP 10 分钟最多 10 次尝试（单进程部署下有效）
const attempts = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 10

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a || now - a.ts > WINDOW_MS) {
    attempts.set(ip, { count: 1, ts: now })
    return false
  }
  a.count += 1
  return a.count > MAX_ATTEMPTS
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown'
  if (rateLimited(ip)) return jsonError('尝试过于频繁，请稍后再试', 429)

  let body: { email?: string; password?: string }
  try { body = await req.json() } catch { return jsonError('参数错误', 400) }
  const email = (body.email ?? '').trim().toLowerCase()
  const password = body.password ?? ''
  if (!email || !password) return jsonError('请输入邮箱和密码', 400)

  try {
    const { rows } = await getPool().query(
      'select id, email, name, password_hash from users where email = $1',
      [email],
    )
    const user = rows[0]
    const ok = bcrypt.compareSync(password, user ? user.password_hash : DUMMY_HASH)
    if (!user || !ok) return jsonError('邮箱或密码错误', 401)

    await createSession(user.id)
    attempts.delete(ip)
    return Response.json({ user: { id: String(user.id), email: user.email, name: user.name } })
  } catch {
    return jsonError('登录失败，请重试', 500)
  }
}
