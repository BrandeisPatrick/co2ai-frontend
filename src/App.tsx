import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/shared/components/layout'
import { Dashboard } from '@/features/dashboard'
import { EquipmentInventory } from '@/features/equipment'
import { Analytics } from '@/features/analytics'
import { Settings } from '@/features/settings'
import { Login, SignUp, SetupOrganization, ProtectedRoute } from '@/features/auth'
import { ErrorBoundary } from '@/shared'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Organization setup (requires auth but not org) */}
        <Route
          path="/setup-organization"
          element={
            <ProtectedRoute requireOrganization={false}>
              <SetupOrganization />
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<EquipmentInventory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
