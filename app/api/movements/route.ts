import { getPool } from '@/lib/server/db'
import { getSessionUser } from '@/lib/server/session'
import { jsonError } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

// 公开读（注意 "by" 是 PG 保留字，必须加引号）
export async function GET() {
  try {
    const { rows } = await getPool().query(
      `select id, t, dev, op, "by", proj from movements order by created_at desc limit 500`,
    )
    return Response.json({ rows })
  } catch {
    return jsonError('数据库读取失败', 500)
  }
}

// 登录后可写，body: Movement { id, t, dev, op, by, proj }
export async function POST(req: Request) {
  if (!(await getSessionUser())) return jsonError('未登录', 401)
  let m: { id?: string; t?: string; dev?: string; op?: string; by?: string; proj?: string }
  try { m = await req.json() } catch { return jsonError('参数错误', 400) }
  if (!m.id || !m.t || !m.dev || !m.op || !m.by) return jsonError('参数错误', 400)

  try {
    await getPool().query(
      `insert into movements (id, t, dev, op, "by", proj) values ($1, $2, $3, $4, $5, $6)`,
      [m.id, m.t, m.dev, m.op, m.by, m.proj ?? ''],
    )
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}

// 登录后可删（冒烟测试清理用），body: { ids: string[] }
export async function DELETE(req: Request) {
  if (!(await getSessionUser())) return jsonError('未登录', 401)
  let body: { ids?: string[] }
  try { body = await req.json() } catch { return jsonError('参数错误', 400) }
  if (!Array.isArray(body.ids) || body.ids.length === 0) return jsonError('参数错误', 400)

  try {
    await getPool().query('delete from movements where id = any($1::text[])', [body.ids])
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}
