// 服务端 PostgreSQL 连接池（仅在 API 路由中使用，绝不导入到客户端代码）
import { Pool, types } from 'pg'

// pg 默认把 bigint(OID 20) 返回为字符串；equipment.id 在 TS 里是 number，
// 不转换会导致 store 里 ids.includes(id) 静默失败
types.setTypeParser(20, (v) => parseInt(v, 10))

const globalForPg = globalThis as unknown as { pgPool?: Pool }

export function getPool(): Pool {
  if (!globalForPg.pgPool) {
    const url = process.env.DATABASE_URL // 运行时读取（服务端专用，不打进前端包）
    if (!url) throw new Error('DATABASE_URL 未配置')
    // 小机器(2核2G)：连接数压低，本机 socket 延迟极小，5 个足够
    globalForPg.pgPool = new Pool({ connectionString: url, max: 5 })
  }
  return globalForPg.pgPool
}
