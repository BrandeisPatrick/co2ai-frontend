import { Database } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-600">Manage your application preferences</p>
      </div>

      {/* Data Source Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Source</h2>
        <div className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-lg bg-amber-100">
            <Database size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Using Mock Data</h3>
            <p className="text-sm text-gray-600">
              This application is currently running with simulated equipment data for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
