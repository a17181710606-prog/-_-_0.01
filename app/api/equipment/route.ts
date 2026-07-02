import { getPool } from '@/lib/server/db'
import { getSessionUser } from '@/lib/server/session'
import { jsonError } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

const EQ_COLS = 'id,name,brand,model,cat,code,st,own,val,day,dep,tot,av,loc,specs,note'
// 白名单：客户端 patch/insert 只允许这些列，防止注入未知字段
const WRITABLE = ['name', 'brand', 'model', 'cat', 'code', 'st', 'own', 'val', 'day', 'dep', 'tot', 'av', 'loc', 'specs', 'note'] as const
type Writable = (typeof WRITABLE)[number]

// 公开读：前台超市/总览无需登录
export async function GET() {
  try {
    const { rows } = await getPool().query(`select ${EQ_COLS} from equipment order by id`)
    return Response.json({ rows })
  } catch {
    return jsonError('数据库读取失败', 500)
  }
}

// 登录后可写：新增（单条或批量），body: { rows: Omit<Equipment,'id'>[] }
export async function POST(req: Request) {
  if (!(await getSessionUser())) return jsonError('未登录', 401)
  let body: { rows?: Record<string, unknown>[] }
  try { body = await req.json() } catch { return jsonError('参数错误', 400) }
  const input = body.rows
  if (!Array.isArray(input) || input.length === 0) return jsonError('参数错误', 400)

  try {
    const pool = getPool()
    const out: unknown[] = []
    for (const r of input) {
      const keys = WRITABLE.filter(k => k in r)
      if (!keys.includes('name') || !keys.includes('cat')) return jsonError('缺少必填字段 name/cat', 400)
      const cols = keys.map(k => `"${k}"`).join(', ')
      const params = keys.map((_, i) => `$${i + 1}`).join(', ')
      const { rows } = await pool.query(
        `insert into equipment (${cols}) values (${params}) returning ${EQ_COLS}`,
        keys.map(k => r[k as Writable]),
      )
      out.push(rows[0])
    }
    return Response.json({ rows: out })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}

// 登录后可写：更新（单条或批量），body: { ids: number[], patch: Partial<Equipment> }
export async function PATCH(req: Request) {
  if (!(await getSessionUser())) return jsonError('未登录', 401)
  let body: { ids?: number[]; patch?: Record<string, unknown> }
  try { body = await req.json() } catch { return jsonError('参数错误', 400) }
  const { ids, patch } = body
  if (!Array.isArray(ids) || ids.length === 0 || !patch) return jsonError('参数错误', 400)
  const keys = WRITABLE.filter(k => k in patch)
  if (keys.length === 0) return jsonError('无可更新字段', 400)

  try {
    const sets = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
    await getPool().query(
      `update equipment set ${sets} where id = any($${keys.length + 1}::bigint[])`,
      [...keys.map(k => patch[k as Writable]), ids],
    )
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}

// 登录后可写：删除，body: { ids: number[] }
export async function DELETE(req: Request) {
  if (!(await getSessionUser())) return jsonError('未登录', 401)
  let body: { ids?: number[] }
  try { body = await req.json() } catch { return jsonError('参数错误', 400) }
  if (!Array.isArray(body.ids) || body.ids.length === 0) return jsonError('参数错误', 400)

  try {
    await getPool().query('delete from equipment where id = any($1::bigint[])', [body.ids])
    return Response.json({ ok: true })
  } catch {
    return jsonError('数据库写入失败', 500)
  }
}
