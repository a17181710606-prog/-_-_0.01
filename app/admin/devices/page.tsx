'use client'
import DeviceTable from '@/components/admin/DeviceTable'
import DeviceEditor from '@/components/admin/DeviceEditor'
import ImportModal from '@/components/admin/ImportModal'

export default function AdminDevicesPage() {
  return (
    <>
      <DeviceTable />
      <DeviceEditor />
      <ImportModal />
    </>
  )
}
