import AdminSidebar from '@/components/layout/AdminSidebar'
import Toast from '@/components/ui/Toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex" style={{ minHeight: '100vh', background: '#F4F3F0' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
      <Toast />
    </div>
  )
}
