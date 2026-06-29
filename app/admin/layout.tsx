import AdminSidebar from '@/components/layout/AdminSidebar'
import Toast from '@/components/ui/Toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden">{children}</div>
      <Toast />
    </div>
  )
}
