'use client'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'

const ICONS = { ok: '✓', err: '✕', info: 'i' }
const COLORS = {
  ok:   'bg-[oklch(0.64_0.11_152)] text-white',
  err:  'bg-[oklch(0.62_0.16_32)] text-white',
  info: 'bg-[var(--accent)] text-white',
}

function ToastItem({ id, msg, type }: { id: string; msg: string; type: 'ok' | 'err' | 'info' }) {
  const dismiss = useStore(s => s.dismissToast)
  useEffect(() => {
    const t = setTimeout(() => dismiss(id), 3000)
    return () => clearTimeout(t)
  }, [id, dismiss])
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium cursor-pointer ${COLORS[type]}`}
      onClick={() => dismiss(id)}
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
        {ICONS[type]}
      </span>
      {msg}
    </div>
  )
}

export default function Toast() {
  const toasts = useStore(s => s.toasts)
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} />
        </div>
      ))}
    </div>
  )
}
