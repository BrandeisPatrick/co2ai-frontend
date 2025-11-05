import { Equipment, JSONBinExperiment } from '../types'

export interface TimeSeriesDataPoint {
  timestamp: Date
  equipment: Equipment
  originalExperiment: JSONBinExperiment
}

export interface TimeSeriesSnapshot {
  date: Date
  equipment: Equipment[]
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
   */
  generateHistory(equipment: Equipment[]): TimeSeriesSnapshot[] {
    this.snapshots = []

    // Generate snapshots for the past N days
    for (let daysAgo = this.DAYS_OF_HISTORY; daysAgo >= 0; daysAgo--) {
      const snapshotDate = this.getDateNDaysAgo(daysAgo)
      const dayOfWeek = snapshotDate.getDay()
      const hourOfDay = Math.floor(Math.random() * 24)

      // Create historical snapshot with variations
      const historicalEquipment = equipment.map((eq) =>
        this.applyTemporalVariations(eq, dayOfWeek, hourOfDay, daysAgo)
      )

      this.snapshots.push({
        date: snapshotDate,
        equipment: historicalEquipment,
      })
    }

    return this.snapshots
  }

  /**
   * Apply realistic temporal variations to equipment data
   */
  private applyTemporalVariations(
    equipment: Equipment,
    dayOfWeek: number,
    hourOfDay: number,
    daysAgo: number
  ): Equipment {
    // Weekend factor (0.7 on weekends, 1.0 on weekdays)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekendFactor = isWeekend ? 0.7 : 1.0

    // Time of day factor (peaks during work hours 9-17)
    const timeOfDayFactor = this.getTimeOfDayFactor(hourOfDay)

    // Seasonal trend (slight increase over time)
    const trendFactor = 1.0 + (this.DAYS_OF_HISTORY - daysAgo) / this.DAYS_OF_HISTORY * 0.1

    // Random natural variation
    const randomVariation = 0.85 + Math.random() * 0.3 // ±15%

    // Apply all factors
    const combinedFactor = weekendFactor * timeOfDayFactor * trendFactor * randomVariation

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
   * Get time of day factor for usage patterns
   * Higher during work hours (9-17), lower at night
   */
  private getTimeOfDayFactor(hour: number): number {
    if (hour >= 9 && hour <= 17) {
      // Peak hours
      return 1.2
    } else if (hour >= 7 && hour <= 19) {
      // Moderate hours
      return 0.9
    } else {
      // Night hours
      return 0.4
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
   */
  getDailyAggregates(days: number = 30) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)

    const dailyData: {
      [key: string]: {
        date: Date
        totalEmissions: number
        totalConsumption: number
        count: number
      }
    } = {}

    // Group snapshots by day
    this.snapshots.forEach((snapshot) => {
      // Only include snapshots from the requested time range
      if (snapshot.date < startDate) return
      const dateKey = snapshot.date.toISOString().split('T')[0]

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: new Date(snapshot.date),
          totalEmissions: 0,
          totalConsumption: 0,
          count: 0,
        }
      }

      snapshot.equipment.forEach((eq) => {
        dailyData[dateKey].totalEmissions += eq.dailyEmissions.value
        dailyData[dateKey].totalConsumption += eq.powerDraw.value * 24 // Convert to daily kWh
      })
      dailyData[dateKey].count += 1
    })

    // Convert to array and sort by date
    return Object.values(dailyData)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((daily) => ({
        date: daily.date,
        emissions: Math.round(daily.totalEmissions),
        consumption: Math.round(daily.totalConsumption),
      }))
  }

  /**
   * Get weekly aggregated data
   */
  getWeeklyAggregates(weeks: number = 12) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - weeks * 7)

    const weeklyData: {
      [key: string]: {
        week: number
        year: number
        totalEmissions: number
        totalConsumption: number
        count: number
      }
    } = {}

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
          count: 0,
        }
      }

      snapshot.equipment.forEach((eq) => {
        weeklyData[key].totalEmissions += eq.dailyEmissions.value
        weeklyData[key].totalConsumption += eq.powerDraw.value * 24
      })
      weeklyData[key].count += 1
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
      }))
  }

  /**
   * Get monthly aggregated data
   */
  getMonthlyAggregates(months: number = 12) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setMonth(startDate.getMonth() - months)

    const monthlyData: {
      [key: string]: {
        month: string
        year: number
        totalEmissions: number
        totalConsumption: number
        count: number
      }
    } = {}

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    this.snapshots.forEach((snapshot) => {
      if (snapshot.date < startDate) return

      const month = snapshot.date.getMonth()
      const year = snapshot.date.getFullYear()
      const key = `${year}-${month}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: monthNames[month],
          year,
          totalEmissions: 0,
          totalConsumption: 0,
          count: 0,
        }
      }

      snapshot.equipment.forEach((eq) => {
        monthlyData[key].totalEmissions += eq.dailyEmissions.value
        monthlyData[key].totalConsumption += eq.powerDraw.value * 24
      })
      monthlyData[key].count += 1
    })

    return Object.values(monthlyData)
      .sort((a, b) => {
        const aDate = new Date(a.year, monthNames.indexOf(a.month))
        const bDate = new Date(b.year, monthNames.indexOf(b.month))
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
