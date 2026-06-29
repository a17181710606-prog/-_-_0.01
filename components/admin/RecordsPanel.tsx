'use client'
import { useStore } from '@/lib/store'
import { OP_COLORS } from '@/lib/constants'

export default function RecordsPanel() {
  const { movements, recordForm, setRecordForm, submitRecordForm, equipment } = useStore(s => ({
    movements: s.movements,
    recordForm: s.recordForm,
    setRecordForm: s.setRecordForm,
    submitRecordForm: s.submitRecordForm,
    equipment: s.equipment,
  }))

  const allDeviceNames = equipment.map(e => e.name)

  return (
    <div className="flex h-full gap-0">
      {/* left: quick form */}
      <div className="w-72 shrink-0 border-r border-[var(--border)] p-5 space-y-4">
        <div className="font-semibold text-[var(--ink)] text-sm">快速登记</div>

        <FormRow label="操作类型">
          <div className="grid grid-cols-2 gap-1.5">
            {(['出库', '入库', '报修', '预留', '改状态'] as const).map(op => (
              <button
                key={op}
                onClick={() => setRecordForm({ op })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  recordForm.op === op
                    ? 'border-transparent text-white'
                    : 'border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--border-2)]'
                }`}
                style={recordForm.op === op ? {
                  background: OP_COLORS[op] ?? 'var(--accent)',
                  borderColor: OP_COLORS[op] ?? 'var(--accent)',
                } : {}}
              >
                {op}
              </button>
            ))}
          </div>
        </FormRow>

        <FormRow label="设备名称 *">
          <input
            list="device-names"
            value={recordForm.dev}
            onChange={e => setRecordForm({ dev: e.target.value })}
            placeholder="输入或选择设备"
            className={INPUT_CLS}
          />
          <datalist id="device-names">
            {allDeviceNames.map(n => <option key={n} value={n} />)}
          </datalist>
        </FormRow>

        <FormRow label="操作人 *">
          <input
            value={recordForm.by}
            onChange={e => setRecordForm({ by: e.target.value })}
            placeholder="姓名"
            className={INPUT_CLS}
          />
        </FormRow>

        <FormRow label="项目名称">
          <input
            value={recordForm.proj}
            onChange={e => setRecordForm({ proj: e.target.value })}
            placeholder="关联项目（可选）"
            className={INPUT_CLS}
          />
        </FormRow>

        <button
          onClick={submitRecordForm}
          className="w-full py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:bg-[#2347a3] transition-colors"
        >
          保存记录
        </button>
      </div>

      {/* right: records list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="text-sm font-semibold text-[var(--ink)]">出入库记录</div>
          <div className="text-xs text-[var(--ink-5)] mt-0.5">共 {movements.length} 条</div>
        </div>
        <div className="space-y-0 divide-y divide-[var(--border)]">
          {movements.map(m => {
            const color = OP_COLORS[m.op] ?? 'var(--ink-4)'
            return (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--border)]/30 transition-colors">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap shrink-0"
                  style={{ background: color + '20', color }}
                >
                  {m.op}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--ink)] truncate">{m.dev}</div>
                  {m.proj && <div className="text-xs text-[var(--ink-5)] truncate">{m.proj}</div>}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-[var(--ink-3)] font-medium">{m.by}</div>
                  <div className="text-[10px] text-[var(--ink-5)] font-mono">{m.t}</div>
                </div>
              </div>
            )
          })}
          {movements.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center text-[var(--ink-5)]">
              <div className="text-4xl mb-3">📋</div>
              <div>暂无记录</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[var(--ink-5)] font-medium mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

const INPUT_CLS = 'w-full h-9 px-3 text-sm border border-[var(--border)] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--ink)] placeholder:text-[var(--ink-5)]'
