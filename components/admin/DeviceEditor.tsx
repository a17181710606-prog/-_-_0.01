'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { CATS, STATUS } from '@/lib/constants'
import SlideOver from '@/components/ui/SlideOver'
import type { CatKey, StatusKey, OwnerKey } from '@/lib/types'

const BLANK = {
  name: '', brand: '', model: '', cat: 'cinema' as CatKey,
  code: '', st: 'in' as StatusKey, own: '自有' as OwnerKey,
  val: 0, day: 0, dep: 0, tot: 1, av: 1, loc: '', specs: [] as string[], note: '',
}

export default function DeviceEditor() {
  const { deviceEditorOpen, deviceEditorId, closeDeviceEditor, addEquipment, updateEquipment, equipment } = useStore(s => ({
    deviceEditorOpen: s.deviceEditorOpen,
    deviceEditorId: s.deviceEditorId,
    closeDeviceEditor: s.closeDeviceEditor,
    addEquipment: s.addEquipment,
    updateEquipment: s.updateEquipment,
    equipment: s.equipment,
  }))

  const existing = deviceEditorId !== null ? equipment.find(e => e.id === deviceEditorId) : null
  const [form, setForm] = useState({ ...BLANK })
  const [specsText, setSpecsText] = useState('')

  useEffect(() => {
    if (existing) {
      setForm({ ...BLANK, ...existing })
      setSpecsText(existing.specs.join('\n'))
    } else {
      setForm({ ...BLANK })
      setSpecsText('')
    }
  }, [deviceEditorId, deviceEditorOpen])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    const data = { ...form, specs: specsText.split('\n').map(s => s.trim()).filter(Boolean) }
    if (existing) updateEquipment(existing.id, data)
    else addEquipment(data)
    closeDeviceEditor()
  }

  return (
    <SlideOver
      open={deviceEditorOpen}
      onClose={closeDeviceEditor}
      width="w-[480px]"
      title={existing ? '编辑设备' : '添加设备'}
    >
      <div className="p-5 space-y-4">
        <Row label="设备名称 *">
          <Input value={form.name} onChange={v => set('name', v)} placeholder="如：ARRI ALEXA 35" />
        </Row>
        <div className="grid grid-cols-2 gap-3">
          <Row label="品牌">
            <Input value={form.brand} onChange={v => set('brand', v)} placeholder="ARRI" />
          </Row>
          <Row label="型号">
            <Input value={form.model} onChange={v => set('model', v)} placeholder="ALEXA 35" />
          </Row>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Row label="分类">
            <select
              value={form.cat}
              onChange={e => set('cat', e.target.value)}
              className={SELECT_CLS}
            >
              {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Row>
          <Row label="状态">
            <select value={form.st} onChange={e => set('st', e.target.value)} className={SELECT_CLS}>
              {(Object.entries(STATUS) as [string, { label: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Row>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Row label="资产编号">
            <Input value={form.code} onChange={v => set('code', v)} placeholder="CAM-001" />
          </Row>
          <Row label="归属">
            <select value={form.own} onChange={e => set('own', e.target.value)} className={SELECT_CLS}>
              {(['自有', '合作商', '个人挂靠'] as OwnerKey[]).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Row>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Row label="日租金 (¥)">
            <Input type="number" value={String(form.day)} onChange={v => set('day', Number(v))} placeholder="0" />
          </Row>
          <Row label="押金 (¥)">
            <Input type="number" value={String(form.dep)} onChange={v => set('dep', Number(v))} placeholder="0" />
          </Row>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Row label="资产价值 (¥)">
            <Input type="number" value={String(form.val)} onChange={v => set('val', Number(v))} placeholder="0" />
          </Row>
          <Row label="总数量">
            <Input type="number" value={String(form.tot)} onChange={v => set('tot', Number(v))} placeholder="1" />
          </Row>
          <Row label="可用数量">
            <Input type="number" value={String(form.av)} onChange={v => set('av', Number(v))} placeholder="1" />
          </Row>
        </div>
        <Row label="存放位置">
          <Input value={form.loc} onChange={v => set('loc', v)} placeholder="A柜-01" />
        </Row>
        <Row label="规格参数（每行一条）">
          <textarea
            value={specsText}
            onChange={e => setSpecsText(e.target.value)}
            rows={4}
            placeholder="感光元件: Super 35mm&#10;分辨率: 4K RAW"
            className={INPUT_CLS + ' resize-none'}
          />
        </Row>
        <Row label="备注">
          <Input value={form.note} onChange={v => set('note', v)} placeholder="可选备注信息" />
        </Row>

        <div className="flex gap-3 pt-2">
          <button
            onClick={closeDeviceEditor}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              form.name
                ? 'bg-[var(--accent)] text-white hover:bg-[#2347a3]'
                : 'bg-[var(--border)] text-[var(--ink-5)] cursor-not-allowed'
            }`}
          >
            {existing ? '保存更改' : '添加设备'}
          </button>
        </div>
      </div>
    </SlideOver>
  )
}

const INPUT_CLS = 'w-full h-9 px-3 text-sm border border-[var(--border)] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)] placeholder:text-[var(--ink-5)]'
const SELECT_CLS = 'w-full h-9 px-2 text-sm border border-[var(--border)] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)]'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[var(--ink-5)] font-medium mb-1 block">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={INPUT_CLS}
    />
  )
}
