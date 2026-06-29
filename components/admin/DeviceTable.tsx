'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { CATS, STATUS, catLabel } from '@/lib/constants'
import { fmtCNY } from '@/lib/utils'
import type { StatusKey, CatKey } from '@/lib/types'

const ROWCOLS = '34px 92px 1.7fr 84px 116px 80px 60px 78px 86px 78px'
const HATCH = 'repeating-linear-gradient(135deg, #F4F3F0 0 6px, #EFEEEA 6px 12px)'
const SELECT_CLS = 'h-9 pl-[11px] pr-7 border border-[#E4E3DE] rounded-lg bg-white text-[13px] text-[#44423D] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]'
const OWNERS = [{ v: 'all', l: '全部所属方' }, { v: '自有', l: '公司自有' }, { v: '合作商', l: '合作商家' }, { v: '个人挂靠', l: '个人挂靠' }]

export default function DeviceTable() {
  const st = useStore(s => ({
    equipment: s.equipment,
    adminSelectedIds: s.adminSelectedIds,
    adminSearch: s.adminSearch,
    adminCatFilter: s.adminCatFilter,
    adminStatusFilter: s.adminStatusFilter,
    adminOwnerFilter: s.adminOwnerFilter,
    toggleAdminSelect: s.toggleAdminSelect,
    selectAllAdmin: s.selectAllAdmin,
    clearAdminSelect: s.clearAdminSelect,
    openDeviceEditor: s.openDeviceEditor,
    deleteEquipment: s.deleteEquipment,
    updateEquipmentStatus: s.updateEquipmentStatus,
    batchSetStatus: s.batchSetStatus,
    setAdminSearch: s.setAdminSearch,
    setAdminCatFilter: s.setAdminCatFilter,
    setAdminStatusFilter: s.setAdminStatusFilter,
    setAdminOwnerFilter: s.setAdminOwnerFilter,
    setImportModalOpen: s.setImportModalOpen,
  }))
  const [menuId, setMenuId] = useState<number | null>(null)

  const filtered = st.equipment.filter(e => {
    if (st.adminCatFilter !== 'all' && e.cat !== st.adminCatFilter) return false
    if (st.adminStatusFilter !== 'all' && e.st !== st.adminStatusFilter) return false
    if (st.adminOwnerFilter !== 'all' && e.own !== st.adminOwnerFilter) return false
    if (st.adminSearch.trim()) {
      const q = st.adminSearch.trim().toLowerCase()
      if (!(e.name + ' ' + e.brand + ' ' + e.model + ' ' + e.code).toLowerCase().includes(q)) return false
    }
    return true
  })

  const ids = filtered.map(e => e.id)
  const allSelected = ids.length > 0 && ids.every(id => st.adminSelectedIds.includes(id))
  const hasSel = st.adminSelectedIds.length > 0

  return (
    <div style={{ padding: '24px 28px 60px' }} onClick={() => setMenuId(null)}>
      {/* title + actions */}
      <div className="flex items-end justify-between flex-wrap" style={{ gap: '14px', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 2px', fontSize: '21px', fontWeight: 700 }}>设备管理</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#76746E' }}>
            共 <span className="font-mono">{st.equipment.length}</span> 个型号 · 当前 <span className="font-mono">{filtered.length}</span> 条
          </p>
        </div>
        <div className="flex" style={{ gap: '9px' }}>
          <button
            onClick={() => st.setImportModalOpen(true)}
            className="flex items-center cursor-pointer transition-colors hover:!border-[#1C1B19] hover:!bg-[#F4F3F0]"
            style={{ gap: '7px', height: '38px', padding: '0 14px', borderRadius: '9px', border: '1px solid #E4E3DE', background: '#fff', color: '#44423D', fontSize: '14px' }}
          >
            导入 Excel
          </button>
          <button
            onClick={() => st.openDeviceEditor(null)}
            className="flex items-center cursor-pointer"
            style={{ gap: '7px', height: '38px', padding: '0 16px', borderRadius: '9px', border: 'none', background: '#2F5AC7', color: '#fff', fontSize: '14px' }}
          >
            + 新增设备
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center" style={{ gap: '10px', marginBottom: '14px' }}>
        <input
          value={st.adminSearch}
          onChange={e => st.setAdminSearch(e.target.value)}
          placeholder="搜索名称 / 型号 / 编号"
          className="focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]"
          style={{ flex: 1, minWidth: '200px', maxWidth: '320px', height: '36px', padding: '0 12px', border: '1px solid #E4E3DE', borderRadius: '8px', background: '#fff', fontSize: '13px' }}
        />
        <select value={st.adminCatFilter} onChange={e => st.setAdminCatFilter(e.target.value as CatKey | 'all')} className={SELECT_CLS}>
          <option value="all">全部分类</option>
          {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={st.adminStatusFilter} onChange={e => st.setAdminStatusFilter(e.target.value as StatusKey | 'all')} className={SELECT_CLS}>
          <option value="all">全部状态</option>
          {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={st.adminOwnerFilter} onChange={e => st.setAdminOwnerFilter(e.target.value)} className={SELECT_CLS}>
          {OWNERS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>

      {/* batch toolbar */}
      {hasSel && (
        <div className="flex items-center flex-wrap" style={{ gap: '12px', padding: '9px 14px', background: '#1C1B19', borderRadius: '10px', marginBottom: '12px', color: '#fff' }}>
          <span style={{ fontSize: '13px' }}>已选 <span className="font-mono">{st.adminSelectedIds.length}</span> 项</span>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.22)' }} />
          <span style={{ fontSize: '12px', color: '#B8B6B0' }}>批量改状态</span>
          <div className="flex flex-wrap" style={{ gap: '6px' }}>
            {(Object.entries(STATUS) as [StatusKey, { label: string }][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => st.batchSetStatus(st.adminSelectedIds, k)}
                className="cursor-pointer transition-colors hover:!bg-[rgba(255,255,255,0.12)]"
                style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.22)', background: 'transparent', color: '#fff' }}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button
            onClick={() => { if (window.confirm(`确认删除 ${st.adminSelectedIds.length} 件设备？`)) st.deleteEquipment(st.adminSelectedIds) }}
            className="cursor-pointer"
            style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: 'none', background: 'oklch(0.55 0.18 25)', color: '#fff' }}
          >
            删除所选
          </button>
          <button onClick={st.clearAdminSelect} className="cursor-pointer" style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.22)', background: 'transparent', color: '#fff' }}>取消</button>
        </div>
      )}

      {/* table */}
      <div style={{ background: '#fff', border: '1px solid #E6E5E1', borderRadius: '12px' }}>
        {/* header row */}
        <div className="grid items-center" style={{ gridTemplateColumns: ROWCOLS, gap: '10px', padding: '11px 16px', borderBottom: '1px solid #EAE9E5', background: '#FAFAF8', fontSize: '11px', color: '#9C9A93', letterSpacing: '0.03em' }}>
          <span><input type="checkbox" checked={allSelected} onChange={() => allSelected ? st.clearAdminSelect() : st.selectAllAdmin(ids)} style={{ cursor: 'pointer', accentColor: '#2F5AC7' }} /></span>
          <span>编号</span><span>名称</span><span>类别</span><span>状态</span><span>所属方</span><span>位置</span>
          <span className="text-right">可借/总</span><span className="text-right">日租</span><span className="text-center">操作</span>
        </div>

        {filtered.map(e => {
          const status = STATUS[e.st]
          const selected = st.adminSelectedIds.includes(e.id)
          return (
            <div key={e.id} className="grid items-center" style={{ gridTemplateColumns: ROWCOLS, gap: '10px', padding: '9px 16px', borderBottom: '1px solid #F2F1ED', background: selected ? '#F4F8FF' : '#fff' }}>
              <span><input type="checkbox" checked={selected} onChange={() => st.toggleAdminSelect(e.id)} style={{ cursor: 'pointer', accentColor: '#2F5AC7' }} /></span>
              <span className="font-mono" style={{ fontSize: '12px', color: '#76746E' }}>{e.code}</span>
              <div className="flex items-center min-w-0" style={{ gap: '10px' }}>
                <div className="shrink-0" style={{ width: '34px', height: '26px', borderRadius: '5px', background: HATCH }} />
                <div className="min-w-0">
                  <div style={{ fontSize: '13px', color: '#1C1B19', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                  <div className="font-mono" style={{ fontSize: '11px', color: '#A6A49C' }}>{e.brand}</div>
                </div>
              </div>
              <span style={{ fontSize: '12.5px', color: '#44423D' }}>{catLabel(e.cat)}</span>
              {/* status pill dropdown */}
              <div className="relative">
                <button
                  onClick={ev => { ev.stopPropagation(); setMenuId(menuId === e.id ? null : e.id) }}
                  className="inline-flex items-center cursor-pointer"
                  style={{ gap: '5px', fontSize: '12px', padding: '3px 9px', borderRadius: '6px', color: status.color, background: `color-mix(in oklch, ${status.color} 13%, white)`, border: `1px solid color-mix(in oklch, ${status.color} 26%, white)`, whiteSpace: 'nowrap' }}
                >
                  <span className="inline-block" style={{ width: '6px', height: '6px', borderRadius: '999px', background: status.color }} />
                  {status.label}
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4}><path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" /></svg>
                </button>
                {menuId === e.id && (
                  <div onClick={ev => ev.stopPropagation()} className="absolute z-30" style={{ top: '30px', left: 0, background: '#fff', border: '1px solid #E4E3DE', borderRadius: '9px', boxShadow: '0 12px 30px rgba(20,20,18,0.16)', padding: '5px', minWidth: '118px' }}>
                    {(Object.entries(STATUS) as [StatusKey, { label: string; color: string }][]).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => { st.updateEquipmentStatus(e.id, k); setMenuId(null) }}
                        className="flex items-center w-full text-left cursor-pointer transition-colors hover:!bg-[#F3F2EE]"
                        style={{ gap: '8px', padding: '7px 9px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '13px', color: '#44423D' }}
                      >
                        <span className="inline-block" style={{ width: '7px', height: '7px', borderRadius: '999px', background: v.color }} />
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '12.5px', color: '#44423D' }}>{e.own}</span>
              <span className="font-mono" style={{ fontSize: '12px', color: '#76746E' }}>{e.loc}</span>
              <span className="font-mono text-right" style={{ fontSize: '12px', color: e.av === 0 ? 'oklch(0.55 0.18 25)' : '#44423D' }}>{e.av} / {e.tot}</span>
              <span className="font-mono text-right" style={{ fontSize: '13px', color: '#1C1B19' }}>{fmtCNY(e.day)}</span>
              <div className="flex items-center justify-center" style={{ gap: '5px' }}>
                <button onClick={() => st.openDeviceEditor(e.id)} className="flex items-center justify-center cursor-pointer transition-colors hover:!border-[#2F5AC7] hover:!text-[#2F5AC7]" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E4E3DE', background: '#fff', color: '#76746E' }} title="编辑">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.4}><path d="M9.4 2.6L11.4 4.6L5 11L2.6 11.4L3 9L9.4 2.6Z" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={() => { if (window.confirm('确认删除该设备？')) st.deleteEquipment([e.id]) }} className="flex items-center justify-center cursor-pointer transition-colors hover:!border-[oklch(0.55_0.18_25)] hover:!text-[oklch(0.55_0.18_25)]" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E4E3DE', background: '#fff', color: '#76746E' }} title="删除">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.4}><line x1="3" y1="4" x2="11" y2="4" strokeLinecap="round" /><path d="M4.2 4L4.7 11.4L9.3 11.4L9.8 4" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div style={{ padding: '50px', textAlign: 'center', color: '#9C9A93', fontSize: '14px' }}>没有符合条件的设备</div>}
      </div>
    </div>
  )
}
