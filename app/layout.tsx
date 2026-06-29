import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '景彩文化 | 器材超市',
  description: '专业影视器材租赁与服务平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
