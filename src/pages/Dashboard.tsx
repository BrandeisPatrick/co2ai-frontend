import { useMemo } from 'react'
import { Activity, Server } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import MonthlyEmissionsTrend from '../components/dashboard/MonthlyEmissionsTrend'
import TopEquipmentChart from '../components/dashboard/TopEquipmentChart'
import { useDataContext } from '../hooks/useDataContext'
import { DashboardData } from '../types'
import {
  getCurrentMonthData,
  getPreviousMonthData,
  sumEmissions,
  calculatePercentageChange,
  kgToTons,
} from '../utils/timeSeriesHelpers'

export default function Dashboard() {
  const { store, isLoading, error } = useDataContext()

  // Derive dashboard data from store using historical data
  const data: DashboardData | null = useMemo(() => {
    if (!store.equipment || store.equipment.length === 0 || !store.historicalData || !store.historicalData.daily) {
      return null
    }

    // Get active equipment count
    const activeCount = store.equipment.length

    // Get current and previous month data from daily aggregates
    const dailyData = store.historicalData.daily
    const currentMonthData = getCurrentMonthData(dailyData)
    const previousMonthData = getPreviousMonthData(dailyData)

    // Calculate monthly totals
    const currentMonthEmissions = sumEmissions(currentMonthData)
    const previousMonthEmissions = sumEmissions(previousMonthData)

    // Calculate month-over-month changes
    const emissionsChangeData = calculatePercentageChange(currentMonthEmissions, previousMonthEmissions)

    // Calculate week-over-week equipment count change
    const weeklyData = store.historicalData.weekly
    const currentWeekEquipment = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1]?.equipmentCount || activeCount : activeCount
    const previousWeekEquipment = weeklyData.length > 1 ? weeklyData[weeklyData.length - 2]?.equipmentCount || activeCount : activeCount
    const equipmentChangeData = calculatePercentageChange(currentWeekEquipment, previousWeekEquipment)

    return {
      emissions: {
        total: kgToTons(currentMonthEmissions), // Convert to tCO2e (month-to-date)
        unit: 'tCO₂e',
        percentageChange: Math.round(emissionsChangeData.change),
        changeType: emissionsChangeData.type,
      },
      activeEquipment: {
        count: activeCount,
        percentageChange: Math.round(equipmentChangeData.change),
        changeType: equipmentChangeData.type,
      },
      // Use real monthly trends from historical data
      monthlyTrend: store.historicalData.monthly.map((month) => ({
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
    } as DashboardData
  }, [store.equipment, store.historicalData])

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
          <p className="text-red-600 dark:text-red-500">{error || 'No data available'}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No data available yet</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEmissionsTrend data={data.monthlyTrend} />
        <TopEquipmentChart data={data.topEquipment} />
      </div>
    </div>
  )
}
