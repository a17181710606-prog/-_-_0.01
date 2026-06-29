import type { Cat, StatusDef, Domain, Role, StatusKey, CatKey, DomainKey, RoleKey } from './types'

export const CATS: Cat[] = [
  { id: 'cinema',    label: '电影机',   en: 'CINEMA' },
  { id: 'lens',      label: '镜头',     en: 'LENS' },
  { id: 'light',     label: '灯光',     en: 'LIGHT' },
  { id: 'monitor',   label: '监视器',   en: 'MONITOR' },
  { id: 'support',   label: '支架稳定', en: 'RIG' },
  { id: 'audio',     label: '录音',     en: 'AUDIO' },
  { id: 'fpv',       label: 'FPV穿越机', en: 'FPV' },
  { id: 'drone',     label: '航拍无人机', en: 'DRONE' },
  { id: 'accessory', label: '附件',     en: 'ACCY' },
]

export const STATUS: Record<StatusKey, StatusDef> = {
  in:       { label: '在库',   color: 'oklch(0.64 0.11 152)' },
  reserved: { label: '已预留', color: 'oklch(0.74 0.12 78)' },
  out:      { label: '已出库', color: 'oklch(0.62 0.08 255)' },
  repair:   { label: '维修中', color: 'oklch(0.62 0.16 32)' },
  inspect:  { label: '待检查', color: 'oklch(0.70 0.03 100)' },
  retired:  { label: '停用',   color: 'oklch(0.52 0.02 0)' },
}

export const DOMAINS: Domain[] = [
  { id: 'auto',   label: '汽车广告',  en: 'AUTOMOTIVE', color: 'oklch(0.55 0.14 25)' },
  { id: 'motion', label: '动态影像',  en: 'MOTION·TVC', color: 'oklch(0.50 0.13 285)' },
  { id: 'aerial', label: '专业航拍',  en: 'AERIAL',     color: 'oklch(0.54 0.12 232)' },
  { id: 'event',  label: '活动拍摄',  en: 'LIVE EVENT', color: 'oklch(0.58 0.13 45)' },
  { id: 'course', label: '课件录制',  en: 'COURSEWARE', color: 'oklch(0.53 0.10 165)' },
  { id: 'ai',     label: 'AI 制作',   en: 'AI STUDIO',  color: 'oklch(0.52 0.14 305)' },
]

export const ROLES: Role[] = [
  { id: 'director', label: '导演 / 创意' },
  { id: 'dp',       label: '摄影指导' },
  { id: 'aerial',   label: '航拍飞手' },
  { id: 'fpv',      label: 'FPV 飞手' },
  { id: 'rig',      label: '稳定器操作' },
  { id: 'light',    label: '灯光指导' },
  { id: 'audio',    label: '录音师' },
  { id: 'color',    label: '调色师' },
  { id: 'ai',       label: 'AI 视觉' },
]

export const OP_COLORS: Record<string, string> = {
  '出库': 'oklch(0.62 0.08 255)',
  '入库': 'oklch(0.64 0.11 152)',
  '报修': 'oklch(0.62 0.16 32)',
  '预留': 'oklch(0.74 0.12 78)',
  '改状态': 'oklch(0.60 0.06 100)',
}

export function catLabel(id: CatKey | string): string {
  return CATS.find(c => c.id === id)?.label ?? id
}
export function catEn(id: CatKey | string): string {
  return CATS.find(c => c.id === id)?.en ?? ''
}
export function domainOf(id: DomainKey | string): Domain {
  return DOMAINS.find(d => d.id === id) ?? { id: 'auto', label: id, en: '', color: '#888' }
}
