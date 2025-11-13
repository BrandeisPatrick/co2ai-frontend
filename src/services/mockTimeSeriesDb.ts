import { Equipment, JSONBinExperiment } from '../types'

export interface TimeSeriesDataPoint {
  timestamp: Date
  equipment: Equipment
  originalExperiment: JSONBinExperiment
}

export interface TimeSeriesSnapshot {
  date: Date
  equipment: Equipment[]
  equipmentCount: number
}

/**
 * Mock Time Series Database
 * Generates realistic historical data based on current equipment
 * Creates variations based on:
 * - Time of day patterns (peak usage during work hours)
 * - Day of week patterns (lower usage on weekends)
 * - Random natural variation (±15%)
 * - Seasonal trends (slight increase over time)
 */
export class MockTimeSeriesDatabase {
  private snapshots: TimeSeriesSnapshot[] = []
  private readonly DAYS_OF_HISTORY = 90 // Generate 90 days of history

  /**
   * Generate historical snapshots from current equipment data
   * Creates ONE snapshot per calendar day with daily aggregated values
   */
  generateHistory(equipment: Equipment[]): TimeSeriesSnapshot[] {
    this.snapshots = []

    // Generate snapshots for the past N days (one per calendar day)
    for (let daysAgo = this.DAYS_OF_HISTORY; daysAgo >= 0; daysAgo--) {
      const snapshotDate = this.getDateNDaysAgo(daysAgo)
      const dayOfWeek = snapshotDate.getDay()

      // Create historical snapshot with daily variations (not hourly)
      const historicalEquipment = equipment.map((eq) =>
        this.applyDailyVariations(eq, dayOfWeek, daysAgo)
      )

      this.snapshots.push({
        date: snapshotDate,
        equipment: historicalEquipment,
        equipmentCount: equipment.length,
      })
    }

    return this.snapshots
  }

  /**
   * Apply realistic daily variations to equipment data
   * Only applies daily-level variations (weekend, seasonal, random)
   * Does NOT apply hourly variations since we're working with daily aggregates
   */
  private applyDailyVariations(
    equipment: Equipment,
    dayOfWeek: number,
    daysAgo: number
  ): Equipment {
    // Weekend factor (0.7 on weekends, 1.0 on weekdays)
    // Lab equipment typically has lower usage on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekendFactor = isWeekend ? 0.7 : 1.0

    // Seasonal trend (slight increase over time)
    // Simulates increasing lab activity as projects progress
    const trendFactor = 1.0 + (this.DAYS_OF_HISTORY - daysAgo) / this.DAYS_OF_HISTORY * 0.1

    // Random natural variation (±15%)
    // Accounts for day-to-day operational variations
    const randomVariation = 0.85 + Math.random() * 0.3

    // Apply daily factors only (no hourly variation)
    const combinedFactor = weekendFactor * trendFactor * randomVariation

    return {
      ...equipment,
      powerDraw: {
        ...equipment.powerDraw,
        value: Number((equipment.powerDraw.value * combinedFactor).toFixed(2)),
      },
      dailyEmissions: {
        ...equipment.dailyEmissions,
        value: Number((equipment.dailyEmissions.value * combinedFactor).toFixed(2)),
      },
    }
  }

  /**
   * Get date N days ago at a random time
   */
  private getDateNDaysAgo(days: number): Date {
    const date = new Date()
    date.setDate(date.getDate() - days)
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0)
    return date
  }

  /**
   * Get snapshots for a specific date range
   */
  getSnapshotsBetween(startDate: Date, endDate: Date): TimeSeriesSnapshot[] {
    return this.snapshots.filter((snapshot) => {
      const snapshotDate = new Date(snapshot.date)
      snapshotDate.setHours(0, 0, 0, 0)
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      return snapshotDate >= start && snapshotDate <= end
    })
  }

  /**
   * Get daily aggregated data (for chart display)
   * Aggregates all equipment values for each day
   */
  getDailyAggregates(days: number = 30) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0) // Start of day

    const dailyData: {
      [key: string]: {
        date: Date
        totalEmissions: number
        totalConsumption: number
      }
    } = {}

    // Aggregate snapshots by calendar day
    this.snapshots.forEach((snapshot) => {
      if (snapshot.date < startDate) return

      const dateKey = snapshot.date.toISOString().split('T')[0]

      if (!dailyData[dateKey]) {
        const date = new Date(snapshot.date)
        date.setHours(0, 0, 0, 0)
        dailyData[dateKey] = {
          date,
          totalEmissions: 0,
          totalConsumption: 0,
        }
      }

      // Sum all equipment values for this day
      snapshot.equipment.forEach((eq) => {
        // dailyEmissions.value is already a daily total
        dailyData[dateKey].totalEmissions += eq.dailyEmissions.value
        // powerDraw.value is hourly average, multiply by 24 to get daily consumption
        dailyData[dateKey].totalConsumption += eq.powerDraw.value * 24
      })
    })

    // Convert to array, sort by date, and format
    return Object.values(dailyData)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((daily) => ({
        date: daily.date.toISOString().split('T')[0], // Return date as string (YYYY-MM-DD)
        emissions: Math.round(daily.totalEmissions),
        consumption: Math.round(daily.totalConsumption),
      }))
  }

  /**
   * Get weekly aggregated data
   * Sums daily values (7 days per week)
   */
  getWeeklyAggregates(weeks: number = 12) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - weeks * 7)
    startDate.setHours(0, 0, 0, 0)

    const weeklyData: {
      [key: string]: {
        week: number
        year: number
        totalEmissions: number
        totalConsumption: number
        equipmentCount: number
      }
    } = {}

    // Aggregate by week
    this.snapshots.forEach((snapshot) => {
      if (snapshot.date < startDate) return

      const week = this.getWeekNumber(snapshot.date)
      const year = snapshot.date.getFullYear()
      const key = `${year}-W${week}`

      if (!weeklyData[key]) {
        weeklyData[key] = {
          week,
          year,
          totalEmissions: 0,
          totalConsumption: 0,
          equipmentCount: snapshot.equipmentCount,
        }
      }

      // Sum all equipment values
      snapshot.equipment.forEach((eq) => {
        weeklyData[key].totalEmissions += eq.dailyEmissions.value
        weeklyData[key].totalConsumption += eq.powerDraw.value * 24
      })
    })

    return Object.values(weeklyData)
      .sort((a, b) => {
        const aDate = new Date(a.year, 0, 1)
        aDate.setDate(aDate.getDate() + (a.week - 1) * 7)
        const bDate = new Date(b.year, 0, 1)
        bDate.setDate(bDate.getDate() + (b.week - 1) * 7)
        return aDate.getTime() - bDate.getTime()
      })
      .map((weekly) => ({
        name: `W${weekly.week}`,
        emissions: Math.round(weekly.totalEmissions),
        consumption: Math.round(weekly.totalConsumption),
        equipmentCount: weekly.equipmentCount,
      }))
  }

  /**
   * Get monthly aggregated data
   * Sums daily values by calendar month
   */
  getMonthlyAggregates(months: number = 12) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setMonth(startDate.getMonth() - months)
    startDate.setDate(1) // Start from first day of month
    startDate.setHours(0, 0, 0, 0)

    const monthlyData: {
      [key: string]: {
        month: string
        monthNumber: number
        year: number
        totalEmissions: number
        totalConsumption: number
      }
    } = {}

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Aggregate by calendar month
    this.snapshots.forEach((snapshot) => {
      if (snapshot.date < startDate) return

      const month = snapshot.date.getMonth()
      const year = snapshot.date.getFullYear()
      const key = `${year}-${month}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: monthNames[month],
          monthNumber: month,
          year,
          totalEmissions: 0,
          totalConsumption: 0,
        }
      }

      // Sum all equipment values for each day
      snapshot.equipment.forEach((eq) => {
        monthlyData[key].totalEmissions += eq.dailyEmissions.value
        monthlyData[key].totalConsumption += eq.powerDraw.value * 24
      })
    })

    return Object.values(monthlyData)
      .sort((a, b) => {
        const aDate = new Date(a.year, a.monthNumber)
        const bDate = new Date(b.year, b.monthNumber)
        return aDate.getTime() - bDate.getTime()
      })
      .map((monthly) => ({
        name: monthly.month,
        emissions: Math.round(monthly.totalEmissions),
        consumption: Math.round(monthly.totalConsumption),
      }))
  }

  /**
   * Get all snapshots
   */
  getAllSnapshots(): TimeSeriesSnapshot[] {
    return [...this.snapshots]
  }

  /**
   * Get week number from date
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }
}

// Singleton instance
export const mockTimeSeriesDb = new MockTimeSeriesDatabase()
