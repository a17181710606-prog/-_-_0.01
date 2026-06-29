'use client'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { STATUS, OP_COLORS } from '@/lib/constants'
import type { Equipment } from '@/lib/types'

const REC_FILTERS: [string, string][] = [
  ['all', '全部'], ['出库', '出库'], ['入库', '入库'], ['改状态', '状态变更'], ['预留', '预留'], ['报修', '报修'],
]

export default function RecordsPanel() {
  const { equipment, movements, addMovement, toast } = useStore(s => ({
    equipment: s.equipment,
    movements: s.movements,
    addMovement: s.addMovement,
    toast: s.toast,
  }))

  const [op, setOp] = useState<'出库' | '入库'>('出库')
  const [scanInput, setScanInput] = useState('')
  const [device, setDevice] = useState('')
  const [by, setBy] = useState('')
  const [proj, setProj] = useState('')
  const [camOpen, setCamOpen] = useState(false)
  const [match, setMatch] = useState<Equipment | null>(null)
  const [recFilter, setRecFilter] = useState('all')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const tryMatch = (raw: string) => {
    const q = raw.trim().toLowerCase()
    if (!q) { setMatch(null); return }
    const found = equipment.find(e => e.code.toLowerCase() === q) || equipment.find(e => e.code.toLowerCase().includes(q))
    if (found) { setMatch(found); setDevice(String(found.id)) }
  }

  const onScanKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { tryMatch(scanInput); }
  }

  // camera scanning (guarded — BarcodeDetector is not in all browsers)
  useEffect(() => {
    if (!camOpen) {
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      return
    }
    let cancelled = false
    let raf = 0
    const Detector = (window as unknown as { BarcodeDetector?: new (o?: unknown) => { detect: (s: unknown) => Promise<{ rawValue: string }[]> } }).BarcodeDetector
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream }
      if (Detector) {
        const det = new Detector({ formats: ['code_128', 'qr_code', 'ean_13', 'code_39'] })
        const scan = async () => {
          if (cancelled || !videoRef.current) return
          try {
            const codes = await det.detect(videoRef.current)
            if (codes[0]?.rawValue) { setScanInput(codes[0].rawValue); tryMatch(codes[0].rawValue); setCamOpen(false); return }
          } catch { /* ignore frame errors */ }
          raf = requestAnimationFrame(scan)
        }
        raf = requestAnimationFrame(scan)
      }
    }).catch(() => { toast('无法访问摄像头', 'err'); setCamOpen(false) })
    return () => { cancelled = true; cancelAnimationFrame(raf); streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [camOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    const dev = match?.name || equipment.find(e => String(e.id) === device)?.name || ''
    if (!dev) { toast('请扫码或选择设备', 'err'); return }
    if (!by.trim()) { toast('请填写经手人', 'err'); return }
    addMovement({ dev, op, by: by.trim(), proj: proj.trim() })
    toast('登记成功', 'ok')
    setScanInput(''); setDevice(''); setBy(''); setProj(''); setMatch(null)
  }

  const recRows = recFilter === 'all' ? movements : movements.filter(r => r.op === recFilter)

  const seg = (active: boolean) => ({
    flex: 1, padding: '8px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px',
    background: active ? '#fff' : 'transparent', color: active ? '#1C1B19' : '#76746E',
    fontWeight: active ? 600 : 400, boxShadow: active ? '0 1px 2px rgba(20,20,18,0.08)' : 'none',
  } as const)
  const INPUT = 'w-full focus:outline-none focus:ring-1 focus:ring-[#2F5AC7]'

  return (
    <div style={{ padding: '24px 28px 60px' }}>
      <h1 style={{ margin: '0 0 16px', fontSize: '21px', fontWeight: 700 }}>出入库记录</h1>
      <div className="grid items-start" style={{ gridTemplateColumns: '300px 1fr', gap: '18px' }}>
        {/* form */}
        <div className="sticky" style={{ top: '18px', background: '#fff', border: '1px solid #E6E5E1', borderRadius: '13px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 13px', fontSize: '15px', fontWeight: 600 }}>快速登记</h3>

          {/* 出库/入库 toggle */}
          <div className="flex" style={{ gap: '5px', marginBottom: '16px', padding: '3px', background: '#F1F0EC', borderRadius: '9px' }}>
            <button onClick={() => setOp('出库')} style={seg(op === '出库')}>出库</button>
            <button onClick={() => setOp('入库')} style={seg(op === '入库')}>入库</button>
          </div>

          {/* scan area */}
          <div style={{ marginBottom: '14px', border: '1px solid #E6E5E1', borderRadius: '11px', overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '11px 12px 10px', background: '#F8F7F4', borderBottom: '1px solid #E6E5E1' }}>
              <div className="flex items-center" style={{ gap: '7px', fontSize: '12.5px', fontWeight: 600, color: '#44423D' }}>扫码录入</div>
              <div className="flex items-center" style={{ gap: '5px', fontSize: '11px', color: '#A6A49C' }}>
                <span className="inline-block" style={{ width: '6px', height: '6px', borderRadius: '999px', background: 'oklch(0.62 0.12 152)' }} />USB 枪常驻监听
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <input
                value={scanInput}
                onChange={e => { setScanInput(e.target.value) }}
                onKeyDown={onScanKey}
                placeholder="扫码枪对准后扫描 / 手动输入编号 + Enter"
                className={INPUT + ' font-mono'}
                style={{ height: '40px', padding: '0 12px 0 12px', border: '1.5px dashed #CFD8F5', borderRadius: '9px', background: '#F4F7FE', fontSize: '12.5px', color: '#1C1B19', marginBottom: '9px' }}
              />
              <button
                onClick={() => setCamOpen(v => !v)}
                className="w-full flex items-center justify-center cursor-pointer"
                style={{ gap: '7px', height: '38px', borderRadius: '9px', border: '1px solid #E4E3DE', background: camOpen ? '#1C1B19' : '#fff', color: camOpen ? '#fff' : '#44423D', fontSize: '13px' }}
              >
                {camOpen ? '关闭摄像头' : '打开摄像头扫码'}
              </button>

              {camOpen && (
                <div className="relative" style={{ marginTop: '9px', borderRadius: '9px', overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: '56%', aspectRatio: '1', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '8px', boxShadow: '0 0 0 2000px rgba(0,0,0,0.36)' }} />
                  </div>
                </div>
              )}

              {match && (
                <div className="flex items-start" style={{ marginTop: '10px', padding: '11px 12px', background: '#EEF2FD', border: '1.5px solid #C3D3F7', borderRadius: '9px', gap: '10px' }}>
                  <div className="shrink-0" style={{ width: '36px', height: '28px', borderRadius: '6px', background: 'repeating-linear-gradient(135deg,#E8E7E3 0 6px,#DDD 6px 12px)' }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B19', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.name}</div>
                    <div className="flex items-center" style={{ gap: '7px', marginTop: '3px', fontSize: '11.5px' }}>
                      <span className="font-mono" style={{ color: '#76746E' }}>{match.code}</span>
                      <span className="inline-block" style={{ width: '6px', height: '6px', borderRadius: '999px', background: STATUS[match.st].color }} />
                      <span style={{ color: '#76746E' }}>{STATUS[match.st].label}</span>
                    </div>
                  </div>
                  <button onClick={() => { setMatch(null); setScanInput(''); setDevice('') }} className="shrink-0 flex items-center justify-center cursor-pointer" style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(47,90,199,0.15)', color: '#2F5AC7' }}>✕</button>
                </div>
              )}
            </div>
          </div>

          {/* divider */}
          <div className="flex items-center" style={{ gap: '9px', marginBottom: '12px' }}>
            <div className="flex-1" style={{ height: '1px', background: '#EEEDE9' }} />
            <span style={{ fontSize: '11px', color: '#B6B4AC', whiteSpace: 'nowrap' }}>或手动选择设备</span>
            <div className="flex-1" style={{ height: '1px', background: '#EEEDE9' }} />
          </div>

          <select value={device} onChange={e => { setDevice(e.target.value); const f = equipment.find(x => String(x.id) === e.target.value); setMatch(f ?? null) }} className={INPUT + ' cursor-pointer'} style={{ height: '38px', padding: '0 11px', border: '1px solid #E4E3DE', borderRadius: '8px', background: '#fff', fontSize: '13px', color: '#44423D', marginBottom: '13px' }}>
            <option value="">选择设备…</option>
            {equipment.map(e => <option key={e.id} value={e.id}>{e.code} · {e.name}</option>)}
          </select>

          <label style={{ display: 'block', fontSize: '12px', color: '#9C9A93', marginBottom: '5px' }}>经手人</label>
          <input value={by} onChange={e => setBy(e.target.value)} placeholder="如：张磊" className={INPUT} style={{ height: '38px', padding: '0 11px', border: '1px solid #E4E3DE', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }} />
          <label style={{ display: 'block', fontSize: '12px', color: '#9C9A93', marginBottom: '5px' }}>项目 / 备注</label>
          <input value={proj} onChange={e => setProj(e.target.value)} placeholder="如：某汽车 TVC" className={INPUT} style={{ height: '38px', padding: '0 11px', border: '1px solid #E4E3DE', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }} />
          <button onClick={submit} className="w-full cursor-pointer" style={{ height: '42px', borderRadius: '10px', border: 'none', background: '#1C1B19', color: '#fff', fontSize: '15px' }}>确认登记</button>
        </div>

        {/* records list */}
        <div style={{ background: '#fff', border: '1px solid #E6E5E1', borderRadius: '13px', padding: '18px' }}>
          <div className="flex flex-wrap" style={{ gap: '7px', marginBottom: '14px' }}>
            {REC_FILTERS.map(([k, l]) => {
              const active = recFilter === k
              return (
                <button key={k} onClick={() => setRecFilter(k)} className="cursor-pointer" style={{ padding: '5px 12px', borderRadius: '999px', border: active ? '1px solid #1C1B19' : '1px solid #E4E3DE', background: active ? '#1C1B19' : '#fff', color: active ? '#fff' : '#76746E', fontSize: '12.5px' }}>{l}</button>
              )
            })}
          </div>
          <div className="flex flex-col">
            {recRows.map(r => {
              const c = OP_COLORS[r.op] ?? '#9C9A93'
              return (
                <div key={r.id} className="flex items-center" style={{ gap: '14px', padding: '11px 0', borderBottom: '1px solid #F2F1ED' }}>
                  <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '6px', color: c, background: `color-mix(in oklch, ${c} 14%, white)`, fontWeight: 500, whiteSpace: 'nowrap' }}>{r.op}</span>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '13.5px', color: '#1C1B19' }}>{r.dev}</div>
                    {r.proj && <div style={{ fontSize: '11.5px', color: '#A6A49C', marginTop: '2px' }}>{r.proj}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div style={{ fontSize: '12.5px', color: '#76746E' }}>{r.by}</div>
                    <div className="font-mono" style={{ fontSize: '11px', color: '#A6A49C', marginTop: '2px' }}>{r.t}</div>
                  </div>
                </div>
              )
            })}
            {recRows.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#9C9A93', fontSize: '13px' }}>暂无记录</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
