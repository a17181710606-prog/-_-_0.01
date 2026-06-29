'use client'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Equipment, Movement, Talent, Service, RentalOrder, ServiceInquiry, StatusKey, CatKey, Layout } from './types'
import { SEED_EQUIPMENT, SEED_MOVEMENTS, SEED_TALENT, SEED_SERVICES } from './data'

export interface Toast {
  id: string
  msg: string
  type: 'ok' | 'err' | 'info'
}

export interface CartItem {
  equipmentId: number
  qty: number
}

interface State {
  // data
  equipment: Equipment[]
  movements: Movement[]
  talent: Talent[]
  services: Service[]
  orders: RentalOrder[]
  inquiries: ServiceInquiry[]

  // catalog filters
  catFilter: CatKey | 'all'
  statusFilter: StatusKey | 'all'
  searchQ: string
  layout: Layout

  // cart
  cart: CartItem[]
  cartOpen: boolean

  // detail panels
  selectedEquipmentId: number | null
  selectedServiceId: string | null
  selectedTalentId: string | null

  // admin
  adminSelectedIds: number[]
  adminSearch: string
  adminCatFilter: CatKey | 'all'
  adminStatusFilter: StatusKey | 'all'
  deviceEditorOpen: boolean
  deviceEditorId: number | null  // null = new
  importModalOpen: boolean

  // records
  scanActive: boolean
  recordForm: { dev: string; op: string; by: string; proj: string }

  // toast
  toasts: Toast[]
}

interface Actions {
  // filters
  setCatFilter: (v: CatKey | 'all') => void
  setStatusFilter: (v: StatusKey | 'all') => void
  setSearchQ: (v: string) => void
  setLayout: (v: Layout) => void

  // cart
  addToCart: (id: number) => void
  removeFromCart: (id: number) => void
  setCartOpen: (v: boolean) => void
  clearCart: () => void
  submitCart: (projectName: string, days: number) => void

  // detail panels
  openEquipment: (id: number) => void
  closeEquipment: () => void
  openService: (id: string) => void
  closeService: () => void
  openTalent: (id: string) => void
  closeTalent: () => void

  // equipment CRUD
  addEquipment: (e: Omit<Equipment, 'id'>) => void
  updateEquipment: (id: number, patch: Partial<Equipment>) => void
  deleteEquipment: (ids: number[]) => void
  updateEquipmentStatus: (id: number, st: StatusKey) => void

  // admin
  setAdminSearch: (v: string) => void
  setAdminCatFilter: (v: CatKey | 'all') => void
  setAdminStatusFilter: (v: StatusKey | 'all') => void
  toggleAdminSelect: (id: number) => void
  selectAllAdmin: (ids: number[]) => void
  clearAdminSelect: () => void
  openDeviceEditor: (id: number | null) => void
  closeDeviceEditor: () => void
  setImportModalOpen: (v: boolean) => void
  importEquipment: (rows: Omit<Equipment, 'id'>[]) => void

  // records
  addMovement: (m: Omit<Movement, 'id' | 't'>) => void
  setScanActive: (v: boolean) => void
  setRecordForm: (patch: Partial<State['recordForm']>) => void
  submitRecordForm: () => void

  // inquiries
  addInquiry: (serviceId: string, contactName: string) => void

  // toast
  toast: (msg: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void
}

type Store = State & Actions

let nextEqId = SEED_EQUIPMENT.length + 1

export const useStore = create<Store>()(
  immer((set, get) => ({
    // initial state
    equipment: SEED_EQUIPMENT,
    movements: SEED_MOVEMENTS,
    talent: SEED_TALENT,
    services: SEED_SERVICES,
    orders: [],
    inquiries: [],

    catFilter: 'all',
    statusFilter: 'all',
    searchQ: '',
    layout: 'grid',

    cart: [],
    cartOpen: false,

    selectedEquipmentId: null,
    selectedServiceId: null,
    selectedTalentId: null,

    adminSelectedIds: [],
    adminSearch: '',
    adminCatFilter: 'all',
    adminStatusFilter: 'all',
    deviceEditorOpen: false,
    deviceEditorId: null,
    importModalOpen: false,

    scanActive: false,
    recordForm: { dev: '', op: '出库', by: '', proj: '' },

    toasts: [],

    // filter actions
    setCatFilter: (v) => set(s => { s.catFilter = v }),
    setStatusFilter: (v) => set(s => { s.statusFilter = v }),
    setSearchQ: (v) => set(s => { s.searchQ = v }),
    setLayout: (v) => set(s => { s.layout = v }),

    // cart
    addToCart: (id) => set(s => {
      const existing = s.cart.find(i => i.equipmentId === id)
      if (existing) { existing.qty += 1 } else { s.cart.push({ equipmentId: id, qty: 1 }) }
    }),
    removeFromCart: (id) => set(s => {
      s.cart = s.cart.filter(i => i.equipmentId !== id)
    }),
    setCartOpen: (v) => set(s => { s.cartOpen = v }),
    clearCart: () => set(s => { s.cart = [] }),
    submitCart: (projectName, days) => set(s => {
      const order: RentalOrder = {
        id: `ORD-${Date.now()}`,
        projectName,
        items: s.cart.map(i => ({ equipmentId: i.equipmentId, qty: i.qty })),
        days,
        createdAt: new Date().toISOString(),
      }
      s.orders.push(order)
      s.cart = []
      s.cartOpen = false
      s.toasts.push({ id: Date.now().toString(), msg: '租用申请已提交', type: 'ok' })
    }),

    // detail panels
    openEquipment: (id) => set(s => { s.selectedEquipmentId = id }),
    closeEquipment: () => set(s => { s.selectedEquipmentId = null }),
    openService: (id) => set(s => { s.selectedServiceId = id }),
    closeService: () => set(s => { s.selectedServiceId = null }),
    openTalent: (id) => set(s => { s.selectedTalentId = id }),
    closeTalent: () => set(s => { s.selectedTalentId = null }),

    // equipment CRUD
    addEquipment: (e) => set(s => {
      s.equipment.push({ ...e, id: nextEqId++ })
      s.toasts.push({ id: Date.now().toString(), msg: '设备已添加', type: 'ok' })
    }),
    updateEquipment: (id, patch) => set(s => {
      const eq = s.equipment.find(e => e.id === id)
      if (eq) Object.assign(eq, patch)
      s.toasts.push({ id: Date.now().toString(), msg: '设备已更新', type: 'ok' })
    }),
    deleteEquipment: (ids) => set(s => {
      s.equipment = s.equipment.filter(e => !ids.includes(e.id))
      s.adminSelectedIds = []
      s.toasts.push({ id: Date.now().toString(), msg: `已删除 ${ids.length} 件设备`, type: 'ok' })
    }),
    updateEquipmentStatus: (id, st) => set(s => {
      const eq = s.equipment.find(e => e.id === id)
      if (eq) eq.st = st
    }),

    // admin filters
    setAdminSearch: (v) => set(s => { s.adminSearch = v }),
    setAdminCatFilter: (v) => set(s => { s.adminCatFilter = v }),
    setAdminStatusFilter: (v) => set(s => { s.adminStatusFilter = v }),
    toggleAdminSelect: (id) => set(s => {
      const idx = s.adminSelectedIds.indexOf(id)
      if (idx >= 0) s.adminSelectedIds.splice(idx, 1)
      else s.adminSelectedIds.push(id)
    }),
    selectAllAdmin: (ids) => set(s => { s.adminSelectedIds = ids }),
    clearAdminSelect: () => set(s => { s.adminSelectedIds = [] }),
    openDeviceEditor: (id) => set(s => { s.deviceEditorOpen = true; s.deviceEditorId = id }),
    closeDeviceEditor: () => set(s => { s.deviceEditorOpen = false; s.deviceEditorId = null }),
    setImportModalOpen: (v) => set(s => { s.importModalOpen = v }),
    importEquipment: (rows) => set(s => {
      rows.forEach(r => { s.equipment.push({ ...r, id: nextEqId++ }) })
      s.importModalOpen = false
      s.toasts.push({ id: Date.now().toString(), msg: `已导入 ${rows.length} 件设备`, type: 'ok' })
    }),

    // records
    addMovement: (m) => set(s => {
      s.movements.unshift({
        ...m,
        id: `M${Date.now()}`,
        t: new Date().toISOString().slice(0, 16).replace('T', ' '),
      })
    }),
    setScanActive: (v) => set(s => { s.scanActive = v }),
    setRecordForm: (patch) => set(s => { Object.assign(s.recordForm, patch) }),
    submitRecordForm: () => {
      const { recordForm, addMovement, toast } = get()
      if (!recordForm.dev || !recordForm.by) { toast('请填写设备名称和操作人', 'err'); return }
      addMovement({ dev: recordForm.dev, op: recordForm.op as any, by: recordForm.by, proj: recordForm.proj })
      set(s => { s.recordForm = { dev: '', op: '出库', by: '', proj: '' } })
      toast('记录已保存', 'ok')
    },

    // inquiries
    addInquiry: (serviceId, contactName) => set(s => {
      s.inquiries.push({
        id: `INQ-${Date.now()}`,
        serviceId,
        contactName,
        createdAt: new Date().toISOString(),
      })
      s.toasts.push({ id: Date.now().toString(), msg: '咨询已提交，我们会尽快联系您', type: 'ok' })
    }),

    // toast
    toast: (msg, type = 'ok') => set(s => {
      s.toasts.push({ id: Date.now().toString(), msg, type })
    }),
    dismissToast: (id) => set(s => {
      s.toasts = s.toasts.filter(t => t.id !== id)
    }),
  }))
)
