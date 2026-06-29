'use client'
import { useStore } from '@/lib/store'
import { CATS, STATUS } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { StatusKey, CatKey } from '@/lib/types'

export default function DeviceTable() {
  const {
    equipment, adminSelectedIds, adminSearch, adminCatFilter, adminStatusFilter,
    toggleAdminSelect, selectAllAdmin, clearAdminSelect,
    openDeviceEditor, deleteEquipment, updateEquipmentStatus,
    setAdminSearch, setAdminCatFilter, setAdminStatusFilter,
    setImportModalOpen, toast,
  } = useStore(s => ({
    equipment: s.equipment,
    adminSelectedIds: s.adminSelectedIds,
    adminSearch: s.adminSearch,
    adminCatFilter: s.adminCatFilter,
    adminStatusFilter: s.adminStatusFilter,
    toggleAdminSelect: s.toggleAdminSelect,
    selectAllAdmin: s.selectAllAdmin,
    clearAdminSelect: s.clearAdminSelect,
    openDeviceEditor: s.openDeviceEditor,
    deleteEquipment: s.deleteEquipment,
    updateEquipmentStatus: s.updateEquipmentStatus,
    setAdminSearch: s.setAdminSearch,
    setAdminCatFilter: s.setAdminCatFilter,
    setAdminStatusFilter: s.setAdminStatusFilter,
    setImportModalOpen: s.setImportModalOpen,
    toast: s.toast,
  }))

  const filtered = equipment.filter(e => {
    if (adminCatFilter !== 'all' && e.cat !== adminCatFilter) return false
    if (adminStatusFilter !== 'all' && e.st !== adminStatusFilter) return false
    if (adminSearch) {
      const q = adminSearch.toLowerCase()
      if (!e.name.toLowerCase().includes(q) && !e.code.toLowerCase().includes(q) && !e.brand.toLowerCase().includes(q)) return false
    }
    return true
  })

  const filteredIds = filtered.map(e => e.id)
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => adminSelectedIds.includes(id))

  const toggleAll = () => {
    if (allSelected) clearAdminSelect()
    else selectAllAdmin(filteredIds)
  }

  const handleBatchDelete = () => {
    if (!window.confirm(`确认删除 ${adminSelectedIds.length} 件设备？`)) return
    deleteEquipment(adminSelectedIds)
  }

  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] shrink-0 flex-wrap">
        <input
          type="text"
          value={adminSearch}
          onChange={e => setAdminSearch(e.target.value)}
          placeholder="搜索设备名称/编号…"
          className="h-8 px-3 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] w-48"
        />
        <select
          value={adminCatFilter}
          onChange={e => setAdminCatFilter(e.target.value as CatKey | 'all')}
          className="h-8 px-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)] bg-white"
        >
          <option value="all">全部分类</option>
          {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select
          value={adminStatusFilter}
          onChange={e => setAdminStatusFilter(e.target.value as StatusKey | 'all')}
          className="h-8 px-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)] bg-white"
        >
          <option value="all">全部状态</option>
          {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        {adminSelectedIds.length > 0 && (
          <button
            onClick={handleBatchDelete}
            className="h-8 px-3 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            删除 ({adminSelectedIds.length})
          </button>
        )}
        <button
          onClick={() => setImportModalOpen(true)}
          className="h-8 px-3 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors font-medium text-[var(--ink-3)]"
        >
          导入 Excel
        </button>
        <button
          onClick={() => openDeviceEditor(null)}
          className="h-8 px-4 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[#2347a3] transition-colors font-semibold"
        >
          + 添加设备
        </button>
      </div>

      {/* count */}
      <div className="px-4 py-2 text-xs text-[var(--ink-5)] border-b border-[var(--border)] shrink-0">
        显示 {filtered.length} / {equipment.length} 件设备
        {adminSelectedIds.length > 0 && <span className="ml-2 text-[var(--accent)]">已选 {adminSelectedIds.length}</span>}
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-white/95 backdrop-blur">
            <tr className="border-b border-[var(--border)]">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-[var(--accent)]"
                />
              </th>
              <Th>编号</Th>
              <Th>名称</Th>
              <Th>品牌/型号</Th>
              <Th>分类</Th>
              <Th>状态</Th>
              <Th>日租</Th>
              <Th>押金</Th>
              <Th>位置</Th>
              <Th>操作</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const status = STATUS[e.st]
              const selected = adminSelectedIds.includes(e.id)
              return (
                <tr
                  key={e.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--border)]/40 transition-colors ${selected ? 'bg-[var(--accent-sel)]' : ''}`}
                >
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAdminSelect(e.id)}
                      className="accent-[var(--accent)]"
                    />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-[var(--ink-4)]">{e.code}</td>
                  <td className="px-4 py-2.5 font-medium text-[var(--ink)] max-w-[180px] truncate">{e.name}</td>
                  <td className="px-4 py-2.5 text-[var(--ink-3)]">{e.brand} {e.model}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-[var(--ink-4)]">
                      {CATS.find(c => c.id === e.cat)?.label ?? e.cat}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={e.st}
                      onChange={ev => updateEquipmentStatus(e.id, ev.target.value as StatusKey)}
                      className="text-xs px-2 py-0.5 rounded-full border-0 font-medium cursor-pointer focus:outline-none"
                      style={{ background: status.color + '22', color: status.color }}
                    >
                      {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[var(--accent)] font-medium">{fmtCNY(e.day)}</td>
                  <td className="px-4 py-2.5 font-mono text-[var(--ink-3)]">{fmtCNY(e.dep)}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--ink-4)]">{e.loc}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => openDeviceEditor(e.id)}
                      className="text-xs text-[var(--accent)] hover:underline"
                    >
                      编辑
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center text-[var(--ink-5)]">
            <div className="text-4xl mb-3">📦</div>
            <div>没有符合条件的设备</div>
          </div>
        )}
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--ink-5)] uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  )
}
