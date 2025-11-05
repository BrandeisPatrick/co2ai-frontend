import { useState, useMemo } from 'react'
import { Activity, Server, Gauge, Zap, RefreshCw } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import MonthlyEmissionsTrend from '../components/dashboard/MonthlyEmissionsTrend'
import TopEquipmentChart from '../components/dashboard/TopEquipmentChart'
import PredictiveAlerts from '../components/dashboard/PredictiveAlerts'
import { useDataContext } from '../hooks/useDataContext'
import { DashboardData } from '../types'

export default function Dashboard() {
  const { store, isLoading, error, syncData } = useDataContext()
  const [isSyncing, setIsSyncing] = useState(false)

  // Derive dashboard data from store using historical data
  const data: DashboardData | null = useMemo(() => {
    if (!store.equipment || store.equipment.length === 0 || !store.historicalData) {
      return null
    }

    // Calculate current metrics from equipment data
    const totalEmissions = store.equipment.reduce((sum, eq) => sum + eq.dailyEmissions.value, 0)
    const activeCount = store.equipment.filter(eq => eq.status === 'active').length

    // Use historical monthly data for trends
    const monthlyData = store.historicalData.monthly

    // Calculate month-over-month change
    const lastMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].emissions : 0
    const previousMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2].emissions : lastMonth
    const emissionsChange = previousMonth > 0 ? Math.round(((lastMonth - previousMonth) / previousMonth) * 100) : 5

    const lastMonthConsumption = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].consumption : 0
    const previousMonthConsumption = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2].consumption : lastMonthConsumption
    const consumptionChange = previousMonthConsumption > 0 ? Math.round(((lastMonthConsumption - previousMonthConsumption) / previousMonthConsumption) * 100) : 8

    return {
      emissions: {
        total: Number((totalEmissions / 1000).toFixed(2)), // Convert to tCO2e
        unit: 'tCO₂e',
        percentageChange: emissionsChange,
        changeType: emissionsChange >= 0 ? ('increase' as const) : ('decrease' as const),
      },
      activeEquipment: {
        count: activeCount,
        percentageChange: 3,
        changeType: 'increase' as const,
      },
      efficiency: {
        score: Math.round((activeCount / store.equipment.length) * 100),
        maxScore: 100,
        percentageChange: 12,
        changeType: 'increase' as const,
        improvement: true,
      },
      monthlyConsumption: {
        value: Number((lastMonthConsumption / 1000).toFixed(2)), // Convert to MWh
        unit: 'MWh',
        percentageChange: consumptionChange,
        changeType: consumptionChange >= 0 ? ('increase' as const) : ('decrease' as const),
      },
      // Use real monthly trends from historical data
      monthlyTrend: monthlyData.map((month) => ({
        month: month.name,
        emissions: month.emissions,
      })),
      topEquipment: store.equipment
        .sort((a, b) => b.dailyEmissions.value - a.dailyEmissions.value)
        .slice(0, 5)
        .map((eq, idx) => ({
          name: eq.name,
          emissions: eq.dailyEmissions.value,
          color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'][idx],
        })),
      alerts: store.equipment
        .filter(eq => eq.dailyEmissions.value > 50)
        .map(eq => ({
          id: eq.id,
          type: 'optimization' as const,
          title: `High emissions detected`,
          equipment: eq.name,
          equipmentId: eq.equipmentId,
          description: `${eq.name} is emitting ${eq.dailyEmissions.value} ${eq.dailyEmissions.unit}. Consider reducing usage or optimizing operations.`,
          potentialSavings: '15-25%',
          actionLabel: 'View Recommendations',
        })),
    }
  }, [store.equipment, store.historicalData])

  const handleManualSync = async () => {
    setIsSyncing(true)
    try {
      await syncData()
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-500 mb-4">{error || 'No data available'}</p>
          <button
            onClick={handleManualSync}
            className="px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No data available yet</p>
          <button
            onClick={handleManualSync}
            className="px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Load Data
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time wet lab equipment emissions monitoring</p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
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
