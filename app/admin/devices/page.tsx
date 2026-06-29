'use client'
import DeviceTable from '@/components/admin/DeviceTable'
import DeviceEditor from '@/components/admin/DeviceEditor'
import ImportModal from '@/components/admin/ImportModal'

export default function AdminDevicesPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <DeviceTable />
      <DeviceEditor />
      <ImportModal />
    </div>
  )
}
