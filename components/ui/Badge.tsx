interface Props {
  color: string
  label: string
  size?: 'sm' | 'md'
}

export default function Badge({ color, label, size = 'sm' }: Props) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${pad}`}
      style={{ background: color + '22', color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </span>
  )
}
