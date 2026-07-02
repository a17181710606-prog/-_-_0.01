// 数据访问层 —— 同源 fetch 调用本项目 /api 路由（后端为本机 PostgreSQL）。
// 未启用数据库（NEXT_PUBLIC_ENABLE_DB != '1'）时，store 兜底回退到种子数据。
import type { Equipment, Movement, RentalOrder, ServiceInquiry } from './types'

export const dbEnabled = () => process.env.NEXT_PUBLIC_ENABLE_DB === '1'

async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: string } | null
    throw new Error(body?.error || `请求失败 (${res.status})`)
  }
  return res.json() as Promise<T>
}

// ── equipment ─────────────────────────────────────────────
export async function fetchEquipment(): Promise<Equipment[]> {
  return (await api<{ rows: Equipment[] }>('/equipment')).rows
}

export async function insertEquipment(e: Omit<Equipment, 'id'>): Promise<Equipment> {
  const { rows } = await api<{ rows: Equipment[] }>('/equipment', {
    method: 'POST',
    body: JSON.stringify({ rows: [e] }),
  })
  return rows[0]
}

export async function insertEquipmentMany(rows: Omit<Equipment, 'id'>[]): Promise<Equipment[]> {
  return (await api<{ rows: Equipment[] }>('/equipment', {
    method: 'POST',
    body: JSON.stringify({ rows }),
  })).rows
}

export async function updateEquipment(id: number, patch: Partial<Equipment>): Promise<void> {
  const clean = { ...patch }; delete clean.id
  await api('/equipment', { method: 'PATCH', body: JSON.stringify({ ids: [id], patch: clean }) })
}

export async function updateEquipmentMany(ids: number[], patch: Partial<Equipment>): Promise<void> {
  const clean = { ...patch }; delete clean.id
  await api('/equipment', { method: 'PATCH', body: JSON.stringify({ ids, patch: clean }) })
}

export async function deleteEquipment(ids: number[]): Promise<void> {
  await api('/equipment', { method: 'DELETE', body: JSON.stringify({ ids }) })
}

// ── movements ─────────────────────────────────────────────
export async function fetchMovements(): Promise<Movement[]> {
  return (await api<{ rows: Movement[] }>('/movements')).rows
}

export async function insertMovement(m: Movement): Promise<void> {
  await api('/movements', { method: 'POST', body: JSON.stringify(m) })
}

// ── rental orders / inquiries（前台公开表单，仅写入）─────────
export async function insertOrder(o: RentalOrder): Promise<void> {
  await api('/orders', { method: 'POST', body: JSON.stringify(o) })
}

export async function insertInquiry(i: ServiceInquiry): Promise<void> {
  await api('/inquiries', { method: 'POST', body: JSON.stringify(i) })
}
