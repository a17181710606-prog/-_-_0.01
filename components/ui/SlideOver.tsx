'use client'
import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  width?: string
  children: React.ReactNode
}

export default function SlideOver({ open, onClose, title, width = 'w-[480px]', children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* panel */}
      <div
        ref={ref}
        className={`relative ${width} max-w-full h-full bg-[var(--bg)] shadow-2xl flex flex-col overflow-hidden animate-slide-in`}
        style={{ animation: 'slideIn 200ms ease forwards' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
            <div className="font-semibold text-[var(--ink)]">{title}</div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--ink-4)] hover:bg-[var(--border)] hover:text-[var(--ink)] transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
