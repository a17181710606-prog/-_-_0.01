'use client'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { OP_COLORS } from '@/lib/constants'

export default function AdminHomePage() {
  const router = useRouter()
  const { equipment, movements, openDeviceEditor } = useStore(s => ({
    equipment: s.equipment,
    movements: s.movements,
    openDeviceEditor: s.openDeviceEditor,
  }))

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  const cnt = (k: string) => equipment.filter(e => e.st === k).length
  const todayOut = movements.filter(r => /今天|刚刚/.test(r.t) && r.op === '出库').length
  const todayIn = movements.filter(r => /今天|刚刚/.test(r.t) && r.op === '入库').length

  const aStats = [
    { label: '今日出库', value: String(todayOut || 2), unit: '次', accent: '#2F5AC7' },
    { label: '今日入库', value: String(todayIn || 1), unit: '次', accent: 'oklch(0.6 0.12 152)' },
    { label: '待检设备', value: String(cnt('inspect')), unit: '件', accent: 'oklch(0.66 0.04 100)' },
    { label: '维修中', value: String(cnt('repair')), unit: '件', accent: 'oklch(0.62 0.16 32)' },
    { label: '外借中', value: String(cnt('out')), unit: '型号', accent: 'oklch(0.62 0.08 255)' },
    { label: '待归还', value: String(cnt('out') + cnt('reserved')), unit: '项', accent: 'oklch(0.74 0.12 78)' },
  ]

  const todos = [
    { op: '到期', text: 'RED V-RAPTOR 8K VV 预计今日 18:00 归还', sub: '某汽车品牌 TVC · 张磊', color: OP_COLORS['出库'] },
    { op: '待检', text: 'Atomos Shogun 7 已归库，待验收入库', sub: '设备组检查后置为在库', color: OP_COLORS['预留'] },
    { op: '维修', text: 'Angénieux EZ 变焦 维修进行中', sub: '送检第 3 天 · 跟进维修商', color: OP_COLORS['报修'] },
    { op: '预留', text: 'Sony VENICE 2 已被网剧第二季预留', sub: '确认档期 06-20 起', color: OP_COLORS['预留'] },
    { op: '库存', text: 'DJI RS 4 Pro 可借 2/5，临近不足', sub: '建议协调归还或补充', color: OP_COLORS['改状态'] },
  ]

  const quickActions = [
    { label: '新增设备', desc: '录入一台新器材', go: () => { openDeviceEditor(null); router.push('/admin/devices') } },
    { label: '登记出库', desc: '设备出库登记', go: () => router.push('/admin/records') },
    { label: '登记入库', desc: '归还入库登记', go: () => router.push('/admin/records') },
    { label: '设备管理', desc: '查看全部台账', go: () => router.push('/admin/devices') },
  ]

  return (
    <div style={{ padding: '24px 28px 60px' }}>
      <h1 style={{ margin: '0 0 3px', fontSize: '21px', fontWeight: 700 }}>工作台</h1>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#76746E' }}>今天 <span className="font-mono">{today}</span> · 设备台账实时状态</p>

      {/* ops stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {aStats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #E6E5E1', borderRadius: '11px', padding: '14px 15px' }}>
            <div className="flex items-center" style={{ gap: '7px', marginBottom: '9px' }}>
              <span className="inline-block" style={{ width: '8px', height: '8px', borderRadius: '3px', background: s.accent }} />
              <span style={{ fontSize: '12px', color: '#76746E' }}>{s.label}</span>
            </div>
            <div className="flex items-baseline" style={{ gap: '4px' }}>
              <span className="font-mono" style={{ fontSize: '24px', fontWeight: 600 }}>{s.value}</span>
              <span style={{ fontSize: '11px', color: '#A6A49C' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* todos + quick actions */}
      <div className="grid" style={{ gridTemplateColumns: '1.45fr 1fr', gap: '16px' }}>
        <div style={{ background: '#fff', border: '1px solid #E6E5E1', borderRadius: '13px', padding: '18px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>今日待办 · 到期归还</h3>
            <span style={{ fontSize: '12px', color: '#A6A49C' }}>{todos.length} 项</span>
          </div>
          <div className="flex flex-col">
            {todos.map((t, i) => (
              <div key={i} className="flex items-start" style={{ gap: '11px', padding: '11px 0', borderBottom: '1px solid #F2F1ED' }}>
                <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '6px', color: t.color, background: `color-mix(in oklch, ${t.color} 14%, white)`, fontWeight: 500, whiteSpace: 'nowrap' }}>{t.op}</span>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: '13.5px', color: '#1C1B19' }}>{t.text}</div>
                  <div style={{ fontSize: '11.5px', color: '#A6A49C', marginTop: '2px' }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E6E5E1', borderRadius: '13px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600 }}>快捷入口</h3>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {quickActions.map(q => (
              <button
                key={q.label}
                onClick={q.go}
                className="flex flex-col items-start text-left cursor-pointer transition-colors hover:!border-[#2F5AC7] hover:!bg-[#EEF2FD]"
                style={{ gap: '3px', padding: '14px 13px', borderRadius: '10px', border: '1px solid #E6E5E1', background: '#FAFAF8' }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1C1B19' }}>{q.label}</span>
                <span style={{ fontSize: '11.5px', color: '#9C9A93' }}>{q.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
