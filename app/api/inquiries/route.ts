import { getPool } from '@/lib/server/db'
import { jsonError } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

// 前台公开表单：匿名可提交服务咨询
export async function POST(req: Request) {
  let i: { id?: string; serviceId?: string; contactName?: string }
  try { i = await req.json() } catch { return jsonError('参数错误', 400) }
  if (!i.id || !i.serviceId || !i.contactName) return jsonError('参数错误', 400)

  try {
    await getPool().query(
      `insert into service_inquiries (id, service_id, contact_name) values ($1, $2, $3)`,
      [i.id, i.serviceId, i.contactName],
    )
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}
