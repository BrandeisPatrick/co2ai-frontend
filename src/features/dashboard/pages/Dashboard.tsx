import { Activity, Server } from 'lucide-react'
import StatCard from '../components/StatCard'
import MonthlyEmissionsTrend from '../components/MonthlyEmissionsTrend'
import TopEquipmentChart from '../components/TopEquipmentChart'
import { useDataContext } from '@/shared/hooks/useDataContext'
import { useDashboardData } from '../hooks/useDashboardData'
import { SkeletonDashboard } from '@/shared/components/ui/skeleton'

export default function Dashboard() {
  const { store, isLoading, error } = useDataContext()
  const { data } = useDashboardData(store)

  if (isLoading && !data) {
    return <SkeletonDashboard />
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600">{error || 'No data available'}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">No data available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Real-time wet lab equipment emissions monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          index={0}
          title="Total Emissions"
          value={data.emissions.total}
          unit={data.emissions.unit}
          icon={Activity}
          trend={{
            value: data.emissions.percentageChange,
            type: data.emissions.changeType,
            label: `${data.emissions.percentageChange}% vs last month`
          }}
        />
        <StatCard
          index={1}
          title="Active Equipment"
          value={data.activeEquipment.count}
          icon={Server}
          trend={{
            value: data.activeEquipment.percentageChange,
            type: data.activeEquipment.changeType,
            label: `${data.activeEquipment.percentageChange}% from last month`
          }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <MonthlyEmissionsTrend data={data.monthlyTrend} />
        <TopEquipmentChart data={data.topEquipment} />
      </div>
    </div>
  )
}
