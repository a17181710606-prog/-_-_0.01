export type CatKey = 'cinema' | 'lens' | 'light' | 'monitor' | 'support' | 'audio' | 'fpv' | 'drone' | 'accessory'
export type StatusKey = 'in' | 'reserved' | 'out' | 'repair' | 'inspect' | 'retired'
export type OwnerKey = '自有' | '合作商' | '个人挂靠'
export type DomainKey = 'auto' | 'motion' | 'aerial' | 'event' | 'course' | 'ai'
export type RoleKey = 'director' | 'dp' | 'aerial' | 'fpv' | 'rig' | 'light' | 'audio' | 'color' | 'ai'
export type OpKey = '出库' | '入库' | '报修' | '预留' | '改状态'
export type Screen = 'catalog' | 'cart' | 'dashboard' | 'services' | 'talent'
export type AdminScreen = 'home' | 'devices' | 'records'
export type Layout = 'grid' | 'aisle' | 'showcase'

export interface Cat {
  id: CatKey
  label: string
  en: string
}

export interface StatusDef {
  label: string
  color: string
}

export interface Equipment {
  id: number
  name: string
  brand: string
  model: string
  cat: CatKey
  code: string
  st: StatusKey
  own: OwnerKey
  val: number
  day: number
  dep: number
  tot: number
  av: number
  loc: string
  specs: string[]
  note: string
}

export interface Movement {
  id: string
  t: string
  dev: string
  op: OpKey
  by: string
  proj: string
}

export interface HardwareItem {
  label: string
  detail: string
}

export interface TalentProject {
  name: string
  year: string
  role: string
}

export interface Talent {
  id: string
  name: string
  initials: string
  role: string
  roleKey: RoleKey
  years: number
  color: string
  specialty: string
  skills: string[]
  gear: string[]
  bio: string
  projects: TalentProject[]
}

export interface Service {
  id: string
  name: string
  domain: DomainKey
  tagline: string
  priceFrom: number
  unit: string
  duration: string
  crew: number
  hw: HardwareItem[]
  caps: string[]
  deliver: string[]
  talent: string[]
  desc: string
}

export interface Domain {
  id: DomainKey
  label: string
  en: string
  color: string
}

export interface Role {
  id: RoleKey | 'all'
  label: string
}

export interface RentalOrder {
  id: string
  projectName: string
  items: { equipmentId: number; qty: number }[]
  days: number
  createdAt: string
}

export interface ServiceInquiry {
  id: string
  serviceId: string
  contactName: string
  createdAt: string
}

export interface ImportRow {
  name: string
  brand: string
  model: string
  cat: CatKey
  code: string
  st: StatusKey
  own: OwnerKey
  val: number
  day: number
  dep: number
  tot: number
  av: number
  loc: string
  specs: string[]
  note: string
  _valid: boolean
  _err: string
}
