import { getPool } from '@/lib/server/db'
import { jsonError } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

// 前台公开表单：匿名可提交租用申请（对应原 RLS 的 anon insert）
export async function POST(req: Request) {
  let o: { id?: string; projectName?: string; items?: unknown[]; days?: number }
  try { o = await req.json() } catch { return jsonError('参数错误', 400) }
  if (!o.id || !o.projectName || !Array.isArray(o.items)) return jsonError('参数错误', 400)

  try {
    // items 必须 JSON.stringify —— pg 会把 JS 数组序列化成 PG 数组字面量，直插 jsonb 会失败
    await getPool().query(
      `insert into rental_orders (id, project_name, items, days) values ($1, $2, $3, $4)`,
      [o.id, o.projectName, JSON.stringify(o.items), o.days ?? 1],
    )
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}
