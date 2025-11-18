import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useDataContext } from '../hooks/useDataContext'
import { formatEmissions } from '../utils/timeSeriesHelpers'

type TimeRange = 'week' | 'month' | 'year'

interface AnalyticsDataSet {
  week: Array<{ name: string; emissions: number }>
  month: Array<{ name: string; emissions: number }>
  year: Array<{ name: string; emissions: number }>
}

function getChartData(timeRange: TimeRange, data: AnalyticsDataSet) {
  return data[timeRange]
}

// Custom tooltip for better readability
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white font-medium">{payload[0].payload.name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const { store, isLoading, error, syncData } = useDataContext()

  // Use real historical data from the data store
  const analyticsData: AnalyticsDataSet | null = useMemo(() => {
    if (!store.historicalData || !store.equipment || store.equipment.length === 0 || !store.historicalData.daily) {
      return null
    }

    // Get the last 7 days of data for week view
    const weekData = store.historicalData.daily
      .slice(-7)
      .map((day) => {
        const date = new Date(day.date + 'T00:00:00')
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          emissions: day.emissions,
        }
      })

    // Get the last 30 days of data for month view
    const monthData = store.historicalData.daily
      .slice(-30)
      .map((day) => {
        const date = new Date(day.date + 'T00:00:00')
        return {
          name: `Day ${date.getDate()}`,
          emissions: day.emissions,
        }
      })

    // Use monthly aggregates for year view
    const yearData = store.historicalData.monthly.map((month) => ({
      name: month.name,
      emissions: month.emissions,
    }))

    return {
      week: weekData,
      month: monthData,
      year: yearData,
    }
  }, [store.historicalData, store.equipment])

  const handleRetry = async () => {
    await syncData()
  }

  if (isLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-500 mb-4">{error || 'No data available'}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
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
            className="px-4 py-2 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Load Data
          </button>
        </div>
      </div>
    )
  }

  const data = getChartData(timeRange, analyticsData)
  const xAxisKey = 'name'

  // Calculate statistics
  const totalEmissions = data.reduce((sum, item) => sum + item.emissions, 0)
  const avgEmissions = totalEmissions / data.length

  // Format values with appropriate units
  const totalEmissionsFormatted = formatEmissions(totalEmissions)
  const avgEmissionsFormatted = formatEmissions(avgEmissions)

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Equipment emissions and energy consumption trends</p>
      </div>

      {/* Time Range Toggle */}
      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg w-fit shadow-sm">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              timeRange === range
                ? 'bg-emerald-500 dark:bg-blue-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Emissions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmissionsFormatted.value}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{totalEmissionsFormatted.unit}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Emissions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgEmissionsFormatted.value}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{avgEmissionsFormatted.unit}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Total Emissions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Total Emissions</h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{totalEmissionsFormatted.unit}</span>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis
                dataKey={xAxisKey}
                stroke="#9ca3af"
                className="dark:stroke-gray-500"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                className="dark:stroke-gray-500"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
                fillOpacity={1}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
