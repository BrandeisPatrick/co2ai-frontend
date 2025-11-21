import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import EquipmentInventory from './pages/EquipmentInventory'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import { AnimatedBackground } from './components/ui/animated-background'

function App() {
  return (
    <>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<EquipmentInventory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
