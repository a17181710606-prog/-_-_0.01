'use client'
import { useStore } from '@/lib/store'
import { CATS } from '@/lib/constants'

export default function StatCards() {
  const equipment = useStore(s => s.equipment)

  const totalUnits = equipment.reduce((s, e) => s + e.tot, 0)
  const availUnits = equipment.reduce((s, e) => s + e.av, 0)
  const outCount = equipment.filter(e => e.st === 'out').length
  const fixCount = equipment.filter(e => e.st === 'repair' || e.st === 'inspect').length
  const valTotal = equipment.reduce((s, e) => s + e.val * e.tot, 0)
  const availRate = totalUnits ? Math.round(availUnits / totalUnits * 100) : 0

  const stats = [
    { label: '设备型号(SKU)', value: String(equipment.length), unit: '种', sub: `共 ${totalUnits} 件实物` },
    { label: '当前可借', value: String(availUnits), unit: '件', sub: `可借率 ${availRate}%` },
    { label: '外借中', value: String(outCount), unit: '型号', sub: '正在项目使用' },
    { label: '维修 / 待检', value: String(fixCount), unit: '型号', sub: '需关注处理' },
    { label: '设备总估值', value: '¥' + (valTotal / 10000).toFixed(0) + '万', unit: '', sub: '按实物数量计' },
    { label: '分类数', value: String(CATS.length), unit: '类', sub: '覆盖全流程器材' },
  ]

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '26px' }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: '#fff', border: '1px solid #E9E8E4', borderRadius: '13px', padding: '16px 17px' }}>
          <div style={{ fontSize: '12px', color: '#9C9A93', marginBottom: '10px' }}>{s.label}</div>
          <div className="flex items-baseline" style={{ gap: '5px' }}>
            <span className="font-mono" style={{ fontSize: '26px', fontWeight: 600, color: '#1C1B19' }}>{s.value}</span>
            <span style={{ fontSize: '12px', color: '#A6A49C' }}>{s.unit}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#A6A49C', marginTop: '7px' }}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
