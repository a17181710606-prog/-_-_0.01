'use client'
import { useState, useRef } from 'react'
import { useStore } from '@/lib/store'
import type { Equipment } from '@/lib/types'

type Step = 'upload' | 'preview'

export default function ImportModal() {
  const { importModalOpen, setImportModalOpen, importEquipment } = useStore(s => ({
    importModalOpen: s.importModalOpen,
    setImportModalOpen: s.setImportModalOpen,
    importEquipment: s.importEquipment,
  }))

  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<Omit<Equipment, 'id'>[]>([])
  const [err, setErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!importModalOpen) return null

  const close = () => { setImportModalOpen(false); setStep('upload'); setRows([]); setErr('') }

  const handleFile = async (file: File) => {
    setErr('')
    try {
      const xlsx = await import('xlsx')
      const buf = await file.arrayBuffer()
      const wb = xlsx.read(buf)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = xlsx.utils.sheet_to_json<Record<string, string | number>>(ws)
      const parsed: Omit<Equipment, 'id'>[] = data.map(r => ({
        name: String(r['名称'] ?? r['name'] ?? ''),
        brand: String(r['品牌'] ?? r['brand'] ?? ''),
        model: String(r['型号'] ?? r['model'] ?? ''),
        cat: (String(r['分类'] ?? r['cat'] ?? 'accessory')) as any,
        code: String(r['编号'] ?? r['code'] ?? ''),
        st: (String(r['状态'] ?? r['st'] ?? 'in')) as any,
        own: (String(r['归属'] ?? r['own'] ?? '自有')) as any,
        val: Number(r['价值'] ?? r['val'] ?? 0),
        day: Number(r['日租'] ?? r['day'] ?? 0),
        dep: Number(r['押金'] ?? r['dep'] ?? 0),
        tot: Number(r['总数量'] ?? r['数量'] ?? r['tot'] ?? r['av'] ?? 1),
        av: Number(r['可用数量'] ?? r['数量'] ?? r['av'] ?? 1),
        loc: String(r['位置'] ?? r['loc'] ?? ''),
        specs: [],
        note: String(r['备注'] ?? r['note'] ?? ''),
      })).filter(r => r.name)
      if (parsed.length === 0) { setErr('文件中未找到有效数据，请检查列标题'); return }
      setRows(parsed)
      setStep('preview')
    } catch (e) {
      setErr('文件解析失败，请确保文件为有效 Excel 格式')
    }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={close} />
      <div className="relative bg-[var(--bg)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="font-semibold text-[var(--ink)]">导入 Excel 设备清单</div>
          <button onClick={close} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--ink-4)] hover:bg-[var(--border)] transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div className="text-sm text-[var(--ink-3)]">
                上传 <strong>.xlsx</strong> 或 <strong>.xls</strong> 文件，系统支持以下列名（中英文均可）：
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-[var(--ink-4)]">
                {[
                  ['名称 / name', '必填'],
                  ['品牌 / brand', ''],
                  ['型号 / model', ''],
                  ['分类 / cat', '分类ID'],
                  ['编号 / code', ''],
                  ['状态 / st', '状态ID'],
                  ['日租 / day', '数字'],
                  ['押金 / dep', '数字'],
                  ['位置 / loc', ''],
                  ['备注 / note', ''],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[var(--border)] rounded px-2.5 py-1.5">
                    <span className="font-mono font-medium text-[var(--ink-3)]">{k}</span>
                    {v && <span className="text-[var(--ink-5)] ml-1">({v})</span>}
                  </div>
                ))}
              </div>

              {/* drop zone */}
              <div
                className="border-2 border-dashed border-[var(--border-2)] rounded-xl p-12 text-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              >
                <div className="text-4xl mb-3">📊</div>
                <div className="text-sm text-[var(--ink-3)] font-medium">点击选择文件 或 拖拽到此处</div>
                <div className="text-xs text-[var(--ink-5)] mt-1">支持 .xlsx / .xls</div>
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

              {err && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{err}</div>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-[var(--ink-3)]">
                解析到 <strong>{rows.length}</strong> 条有效记录，确认后将全部导入。
              </div>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--border)] text-[var(--ink-5)]">
                      {['名称', '品牌', '型号', '分类', '编号', '日租', '位置'].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {rows.slice(0, 20).map((r, i) => (
                      <tr key={i} className="hover:bg-[var(--border)]/40">
                        <td className="px-3 py-2 font-medium text-[var(--ink)]">{r.name}</td>
                        <td className="px-3 py-2 text-[var(--ink-3)]">{r.brand}</td>
                        <td className="px-3 py-2 text-[var(--ink-3)]">{r.model}</td>
                        <td className="px-3 py-2 text-[var(--ink-4)]">{r.cat}</td>
                        <td className="px-3 py-2 font-mono text-[var(--ink-4)]">{r.code}</td>
                        <td className="px-3 py-2 text-[var(--accent)]">¥{r.day}</td>
                        <td className="px-3 py-2 text-[var(--ink-4)]">{r.loc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 20 && (
                  <div className="text-center text-xs text-[var(--ink-5)] py-2">… 还有 {rows.length - 20} 条</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0">
          {step === 'preview' && (
            <button onClick={() => setStep('upload')} className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors font-medium">
              重新上传
            </button>
          )}
          <div className="flex-1" />
          <button onClick={close} className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl text-[var(--ink-3)] hover:bg-[var(--border)] transition-colors font-medium">
            取消
          </button>
          {step === 'preview' && (
            <button
              onClick={() => importEquipment(rows)}
              className="px-6 py-2 text-sm bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[#2347a3] transition-colors"
            >
              确认导入 {rows.length} 条
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
