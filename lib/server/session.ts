// 自建会话：httpOnly cookie（存原始 token）↔ sessions 表（存 sha256 哈希）。
// DB 里只有哈希，即使数据库泄露也无法伪造 cookie。
import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'node:crypto'
import { getPool } from './db'

const COOKIE = 'session'
const TTL_MS = 30 * 24 * 3600 * 1000 // 30 天

const hash = (t: string) => createHash('sha256').update(t).digest('hex')

export interface SessionUser {
  id: number
  email: string
  name: string
}

export async function createSession(userId: number): Promise<void> {
  const raw = randomBytes(32).toString('base64url')
  const expires = new Date(Date.now() + TTL_MS)
  const pool = getPool()
  // 顺手清理过期会话，省去 cron
  await pool.query('delete from sessions where expires_at < now()')
  await pool.query(
    'insert into sessions (token, user_id, expires_at) values ($1, $2, $3)',
    [hash(raw), userId, expires],
  )
  cookies().set(COOKIE, raw, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires,
  })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = cookies().get(COOKIE)?.value
  if (!raw) return null
  const { rows } = await getPool().query(
    `select u.id, u.email, u.name
       from sessions s join users u on u.id = s.user_id
      where s.token = $1 and s.expires_at > now()`,
    [hash(raw)],
  )
  return rows[0] ?? null
}

export async function destroySession(): Promise<void> {
  const raw = cookies().get(COOKIE)?.value
  if (raw) await getPool().query('delete from sessions where token = $1', [hash(raw)])
  cookies().set(COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
}
