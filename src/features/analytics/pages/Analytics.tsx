import { useState, useMemo } from 'react'
import { useDataContext } from '@/shared/hooks/useDataContext'
import { formatEmissions } from '@/services/timeSeries/helpers'
import { EmissionsLineChart } from '@/shared/components/charts'
import { SkeletonDashboard } from '@/shared/components/ui/skeleton'

type TimeRange = 'week' | 'month' | 'year'

interface AnalyticsDataSet {
  week: Array<{ name: string; emissions: number }>
  month: Array<{ name: string; emissions: number }>
  year: Array<{ name: string; emissions: number }>
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const { store, isLoading, error, syncData } = useDataContext()

  const analyticsData: AnalyticsDataSet | null = useMemo(() => {
    if (!store.historicalData || !store.equipment || store.equipment.length === 0 || !store.historicalData.daily) {
      return null
    }

    const weekData = store.historicalData.daily
      .slice(-7)
      .map((day) => {
        const date = new Date(day.date + 'T00:00:00')
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          emissions: day.emissions,
        }
      })

    const monthData = store.historicalData.daily
      .slice(-30)
      .map((day) => {
        const date = new Date(day.date + 'T00:00:00')
        return {
          name: `Day ${date.getDate()}`,
          emissions: day.emissions,
        }
      })

    const yearData = store.historicalData.monthly.map((month) => ({
      name: month.name,
      emissions: month.emissions,
    }))

    return { week: weekData, month: monthData, year: yearData }
  }, [store.historicalData, store.equipment])

  const handleRetry = async () => {
    await syncData()
  }

  if (isLoading && !analyticsData) {
    return <SkeletonDashboard />
  }

  if (error && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No data available'}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No analytics data available</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Load Data
          </button>
        </div>
      </div>
    )
  }

  const data = analyticsData[timeRange]
  const totalEmissions = data.reduce((sum, item) => sum + item.emissions, 0)
  const avgEmissions = totalEmissions / data.length
  const totalEmissionsFormatted = formatEmissions(totalEmissions)
  const avgEmissionsFormatted = formatEmissions(avgEmissions)

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Equipment emissions and energy consumption trends</p>
      </div>

      {/* Time Range Toggle */}
      <div className="flex flex-wrap gap-2 glass-card p-1 rounded-lg w-fit">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-md font-medium transition-all duration-200 ${
              timeRange === range
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="glass-card rounded-lg p-3 md:p-4">
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">{timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Emissions</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{totalEmissionsFormatted.value}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{totalEmissionsFormatted.unit}</p>
        </div>
        <div className="glass-card rounded-lg p-3 md:p-4">
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Avg Emissions</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{avgEmissionsFormatted.value}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{avgEmissionsFormatted.unit}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-4 md:space-y-6">
        <EmissionsLineChart
          data={data}
          title={`${timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Emissions`}
          unit={totalEmissionsFormatted.unit}
        />
      </div>
    </div>
  )
}
