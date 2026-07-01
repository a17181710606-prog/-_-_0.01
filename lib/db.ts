// 数据访问层 —— 封装对 Supabase 的读写。
// 若未配置 Supabase（本地无 key），helper 会抛错，由 store 兜底回退到种子数据。
import { supabase } from './supabase'
import type { Equipment, Movement, RentalOrder, ServiceInquiry } from './types'

export const dbEnabled = () => supabase !== null

function client() {
  if (!supabase) throw new Error('Supabase 未配置')
  return supabase
}

const EQ_COLS = 'id,name,brand,model,cat,code,st,own,val,day,dep,tot,av,loc,specs,note'

// ── equipment ─────────────────────────────────────────────
export async function fetchEquipment(): Promise<Equipment[]> {
  const { data, error } = await client().from('equipment').select(EQ_COLS).order('id')
  if (error) throw error
  return (data ?? []) as Equipment[]
}

export async function insertEquipment(e: Omit<Equipment, 'id'>): Promise<Equipment> {
  const { data, error } = await client().from('equipment').insert(e).select(EQ_COLS).single()
  if (error) throw error
  return data as Equipment
}

export async function insertEquipmentMany(rows: Omit<Equipment, 'id'>[]): Promise<Equipment[]> {
  const { data, error } = await client().from('equipment').insert(rows).select(EQ_COLS)
  if (error) throw error
  return (data ?? []) as Equipment[]
}

export async function updateEquipment(id: number, patch: Partial<Equipment>): Promise<void> {
  const clean = { ...patch }; delete clean.id
  const { error } = await client().from('equipment').update(clean).eq('id', id)
  if (error) throw error
}

export async function updateEquipmentMany(ids: number[], patch: Partial<Equipment>): Promise<void> {
  const clean = { ...patch }; delete clean.id
  const { error } = await client().from('equipment').update(clean).in('id', ids)
  if (error) throw error
}

export async function deleteEquipment(ids: number[]): Promise<void> {
  const { error } = await client().from('equipment').delete().in('id', ids)
  if (error) throw error
}

// ── movements ─────────────────────────────────────────────
export async function fetchMovements(): Promise<Movement[]> {
  const { data, error } = await client()
    .from('movements')
    .select('id,t,dev,op,by,proj')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return (data ?? []) as Movement[]
}

export async function insertMovement(m: Movement): Promise<void> {
  const { error } = await client().from('movements').insert(m)
  if (error) throw error
}

// ── rental orders / inquiries（前台公开表单，仅写入）─────────
export async function insertOrder(o: RentalOrder): Promise<void> {
  const { error } = await client().from('rental_orders').insert({
    id: o.id,
    project_name: o.projectName,
    items: o.items,
    days: o.days,
  })
  if (error) throw error
}

export async function insertInquiry(i: ServiceInquiry): Promise<void> {
  const { error } = await client().from('service_inquiries').insert({
    id: i.id,
    service_id: i.serviceId,
    contact_name: i.contactName,
  })
  if (error) throw error
}
