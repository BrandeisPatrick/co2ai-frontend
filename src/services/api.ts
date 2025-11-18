import { DashboardData, Equipment, TimestampedEquipmentSnapshot } from '../types'
import {
  getLatestSnapshot,
  getAllSnapshots,
  getWeeklyAggregates,
  getMonthlyAggregates
} from './timestampedDataSource'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const apiService = {
  /**
   * Get all timestamped snapshots
   */
  async getSnapshots(): Promise<TimestampedEquipmentSnapshot[]> {
    await delay(500) // Simulate network delay
    return getAllSnapshots()
  },

  /**
   * Get latest equipment snapshot
   */
  async getEquipment(): Promise<Equipment[]> {
    await delay(500) // Simulate network delay
    const snapshot = getLatestSnapshot()
    return snapshot.equipment
  },

  /**
   * Get dashboard data derived from latest snapshot
   */
  async getDashboardData(): Promise<DashboardData> {
    await delay(500) // Simulate network delay

    const snapshot = getLatestSnapshot()
    const equipment = snapshot.equipment

    // Calculate Total Emissions (sum of daily emissions in kgCO₂e, convert to tCO₂e)
    const totalEmissionsKg = snapshot.metadata.totalEmissions
    const totalEmissionsTons = totalEmissionsKg / 1000

    // Get monthly emissions from historical data
    const monthlyData = getMonthlyAggregates(1)
    const currentMonthEmissions = monthlyData.length > 0 ? monthlyData[0].emissions : totalEmissionsKg

    // Get previous month for comparison
    const previousMonthData = getMonthlyAggregates(2)
    const previousMonthEmissions = previousMonthData.length > 1 ? previousMonthData[0].emissions : currentMonthEmissions

    // Calculate emissions percentage change
    const emissionsChange =
      previousMonthEmissions !== 0
        ? ((currentMonthEmissions - previousMonthEmissions) / previousMonthEmissions) * 100
        : 0

    // Calculate equipment count change from weekly data
    const weeklyData = getWeeklyAggregates(2)
    const currentWeekEquipment = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].equipmentCount : equipment.length
    const previousWeekEquipment = weeklyData.length > 1 ? weeklyData[weeklyData.length - 2].equipmentCount : equipment.length
    const equipmentChange =
      previousWeekEquipment !== 0
        ? ((currentWeekEquipment - previousWeekEquipment) / previousWeekEquipment) * 100
        : 0

    // Generate top equipment chart (sorted by daily emissions, top 5)
    const topEquipment = equipment
      .sort((a, b) => b.dailyEmissions.value - a.dailyEmissions.value)
      .slice(0, 5)
      .map((item, index) => {
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
        return {
          name: item.name,
          emissions: item.dailyEmissions.value,
          color: colors[index] || '#60A5FA'
        }
      })

    // Get monthly trend data
    const monthlyTrend = getMonthlyAggregates(12)

    return {
      emissions: {
        total: parseFloat(totalEmissionsTons.toFixed(2)),
        unit: 'tCO₂e',
        percentageChange: Math.round(emissionsChange),
        changeType: emissionsChange >= 0 ? 'increase' : 'decrease'
      },
      activeEquipment: {
        count: equipment.length,
        percentageChange: Math.round(equipmentChange),
        changeType: equipmentChange >= 0 ? 'increase' : 'decrease'
      },
      monthlyTrend: monthlyTrend.map((month) => ({
        month: month.name,
        emissions: month.emissions
      })),
      topEquipment: topEquipment
    }
  },

  /**
   * Add new equipment to current snapshot (for demo purposes)
   */
  async addEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    await delay(500) // Simulate network delay

    // Generate a new ID
    const newId = `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newEquipment: Equipment = {
      ...equipment,
      id: newId
    }

    return newEquipment
  }
}
