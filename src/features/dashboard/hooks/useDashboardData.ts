import { useMemo } from 'react'
import { DashboardData } from '@/types'
import { TOP_EQUIPMENT_COLORS } from '@/constants'
import {
  getCurrentMonthData,
  getPreviousMonthData,
  sumEmissions,
  calculatePercentageChange,
  kgToTons,
} from '@/services/timeSeries/helpers'

interface HistoricalData {
  daily: Array<{ date: string; emissions: number }>
  weekly: Array<{ name: string; emissions: number; equipmentCount: number }>
  monthly: Array<{ name: string; emissions: number }>
}

interface StoreData {
  equipment: Array<{
    id: string
    name: string
    dailyEmissions: { value: number }
  }>
  historicalData: HistoricalData | null
}

interface UseDashboardDataReturn {
  data: DashboardData | null
}

/**
 * Hook for computing dashboard data from store
 */
export function useDashboardData(store: StoreData): UseDashboardDataReturn {
  const data = useMemo(() => {
    if (
      !store.equipment ||
      store.equipment.length === 0 ||
      !store.historicalData ||
      !store.historicalData.daily
    ) {
      return null
    }

    const activeCount = store.equipment.length
    const dailyData = store.historicalData.daily
    const currentMonthData = getCurrentMonthData(dailyData)
    const previousMonthData = getPreviousMonthData(dailyData)

    const currentMonthEmissions = sumEmissions(currentMonthData)
    const previousMonthEmissions = sumEmissions(previousMonthData)
    const emissionsChangeData = calculatePercentageChange(
      currentMonthEmissions,
      previousMonthEmissions
    )

    const weeklyData = store.historicalData.weekly
    const currentWeekEquipment =
      weeklyData.length > 0
        ? weeklyData[weeklyData.length - 1]?.equipmentCount || activeCount
        : activeCount
    const previousWeekEquipment =
      weeklyData.length > 1
        ? weeklyData[weeklyData.length - 2]?.equipmentCount || activeCount
        : activeCount
    const equipmentChangeData = calculatePercentageChange(
      currentWeekEquipment,
      previousWeekEquipment
    )

    return {
      emissions: {
        total: kgToTons(currentMonthEmissions),
        unit: 'tCO₂e',
        percentageChange: Math.round(emissionsChangeData.change),
        changeType: emissionsChangeData.type,
      },
      activeEquipment: {
        count: activeCount,
        percentageChange: Math.round(equipmentChangeData.change),
        changeType: equipmentChangeData.type,
      },
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
          color: TOP_EQUIPMENT_COLORS[idx] || TOP_EQUIPMENT_COLORS[4],
        })),
    } as DashboardData
  }, [store.equipment, store.historicalData])

  return { data }
}
