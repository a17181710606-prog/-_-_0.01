import { getSessionUser } from '@/lib/server/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const u = await getSessionUser()
    return Response.json({ user: u ? { id: String(u.id), email: u.email, name: u.name } : null })
  } catch {
    // 数据库不可用时按未登录处理，避免前端卡死
    return Response.json({ user: null })
  }
}
