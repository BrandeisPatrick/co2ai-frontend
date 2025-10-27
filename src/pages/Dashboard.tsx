import { useEffect, useState } from 'react'
import { Activity, Server, Gauge, Zap } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import MonthlyEmissionsTrend from '../components/dashboard/MonthlyEmissionsTrend'
import TopEquipmentChart from '../components/dashboard/TopEquipmentChart'
import PredictiveAlerts from '../components/dashboard/PredictiveAlerts'
import { apiService } from '../services/api'
import { DashboardData } from '../types'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const dashboardData = await apiService.getDashboardData()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-500 mb-4">{error || 'No data available'}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time wet lab equipment emissions monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
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
          title="Active Equipment"
          value={data.activeEquipment.count}
          icon={Server}
          trend={{
            value: data.activeEquipment.percentageChange,
            type: data.activeEquipment.changeType,
            label: `${data.activeEquipment.percentageChange}% from last month`
          }}
        />
        <StatCard
          title="Efficiency Score"
          value={data.efficiency.score}
          unit={`/${data.efficiency.maxScore}`}
          icon={Gauge}
          trend={{
            value: data.efficiency.percentageChange,
            type: data.efficiency.changeType,
            label: `${data.efficiency.percentageChange}% Improvement`
          }}
          improvement={data.efficiency.improvement}
        />
        <StatCard
          title="Monthly Consumption"
          value={data.monthlyConsumption.value}
          unit={data.monthlyConsumption.unit}
          icon={Zap}
          trend={{
            value: data.monthlyConsumption.percentageChange,
            type: data.monthlyConsumption.changeType,
            label: `${data.monthlyConsumption.percentageChange}% from last month`
          }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEmissionsTrend data={data.monthlyTrend} />
        <TopEquipmentChart data={data.topEquipment} />
      </div>

      {/* Predictive Alerts */}
      <PredictiveAlerts alerts={data.alerts} />
    </div>
  )
}
