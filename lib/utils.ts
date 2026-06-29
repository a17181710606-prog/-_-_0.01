export function fmtCNY(n: number): string {
  return '¥' + n.toLocaleString('zh-CN')
}

export function fmtDate(iso: string): string {
  return iso.slice(0, 10)
}

export function cls(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ')
}
