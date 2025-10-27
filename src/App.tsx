import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import EquipmentInventory from './pages/EquipmentInventory'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="equipment" element={<EquipmentInventory />} />
        <Route path="integrations" element={<div className="p-6 text-gray-900 dark:text-white">API Integrations - Coming Soon</div>} />
        <Route path="reports" element={<div className="p-6 text-gray-900 dark:text-white">Reports - Coming Soon</div>} />
        <Route path="analytics" element={<div className="p-6 text-gray-900 dark:text-white">Analytics - Coming Soon</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
