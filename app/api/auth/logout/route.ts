import { destroySession } from '@/lib/server/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  try { await destroySession() } catch { /* 会话清理失败不阻塞登出 */ }
  return Response.json({ ok: true })
}
