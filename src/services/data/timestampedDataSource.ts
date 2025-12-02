import { TimestampedEquipmentSnapshot } from '@/types'
import { HISTORY_CONFIG } from '@/constants'
import { applyDailyVariations } from '../timeSeries/variationFactors'
import { getDateNDaysAgoMidnight, formatDateString, getWeekNumber, getMonthName } from '../timeSeries/dateUtils'
import { baseEquipment } from './baseEquipment'

/**
 * Generate timestamped snapshots with realistic variations
 * Creates 90 days of historical data with daily variations
 */
export function generateTimestampedSnapshots(): TimestampedEquipmentSnapshot[] {
  const snapshots: TimestampedEquipmentSnapshot[] = []

  for (let daysAgo = HISTORY_CONFIG.DAYS_OF_HISTORY; daysAgo >= 0; daysAgo--) {
    const date = getDateNDaysAgoMidnight(daysAgo)
    const timestamp = date.toISOString()
    const snapshotId = `snap_${formatDateString(date)}`

    // Apply variations to equipment
    const snapshotEquipment = baseEquipment.map((eq) =>
      applyDailyVariations(eq, date, daysAgo)
    )

    // Calculate metadata
    const totalEmissions = Math.round(
      snapshotEquipment.reduce((sum, eq) => sum + eq.dailyEmissions.value, 0)
    )

    snapshots.push({
      timestamp,
      snapshotId,
      equipment: snapshotEquipment,
      metadata: {
        totalEquipmentCount: snapshotEquipment.length,
        totalEmissions,
        dataSource: 'mock',
      },
    })
  }

  return snapshots
}

/**
 * Get all timestamped snapshots
 */
export function getAllSnapshots(): TimestampedEquipmentSnapshot[] {
  return generateTimestampedSnapshots()
}

/**
 * Get latest snapshot
 */
export function getLatestSnapshot(): TimestampedEquipmentSnapshot {
  const snapshots = generateTimestampedSnapshots()
  return snapshots[snapshots.length - 1]
}

/**
 * Get snapshots by date range
 */
export function getSnapshotsByDateRange(
  startDate: Date,
  endDate: Date
): TimestampedEquipmentSnapshot[] {
  const snapshots = generateTimestampedSnapshots()
  return snapshots.filter((snapshot) => {
    const snapshotDate = new Date(snapshot.timestamp)
    return snapshotDate >= startDate && snapshotDate <= endDate
  })
}

/**
 * Get daily aggregates for charts
 */
export function getDailyAggregates(days: number = HISTORY_CONFIG.DEFAULT_DAILY_RANGE) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  return snapshots
    .filter((snapshot) => new Date(snapshot.timestamp) >= startDate)
    .map((snapshot) => ({
      date: snapshot.timestamp.split('T')[0],
      emissions: snapshot.metadata.totalEmissions,
    }))
}

/**
 * Get weekly aggregates for charts
 */
export function getWeeklyAggregates(weeks: number = HISTORY_CONFIG.DEFAULT_WEEKLY_RANGE) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - weeks * 7)
  startDate.setHours(0, 0, 0, 0)

  const weeklyData: Record<string, {
    week: number
    year: number
    totalEmissions: number
    equipmentCount: number
  }> = {}

  snapshots
    .filter((snapshot) => new Date(snapshot.timestamp) >= startDate)
    .forEach((snapshot) => {
      const date = new Date(snapshot.timestamp)
      const week = getWeekNumber(date)
      const year = date.getFullYear()
      const key = `${year}-W${week}`

      if (!weeklyData[key]) {
        weeklyData[key] = {
          week,
          year,
          totalEmissions: 0,
          equipmentCount: snapshot.metadata.totalEquipmentCount,
        }
      }

      weeklyData[key].totalEmissions += snapshot.metadata.totalEmissions
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
      equipmentCount: weekly.equipmentCount,
    }))
}

/**
 * Get monthly aggregates for charts
 */
export function getMonthlyAggregates(months: number = HISTORY_CONFIG.DEFAULT_MONTHLY_RANGE) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setMonth(startDate.getMonth() - months)
  startDate.setDate(1)
  startDate.setHours(0, 0, 0, 0)

  const monthlyData: Record<string, {
    month: string
    monthNumber: number
    year: number
    totalEmissions: number
  }> = {}

  snapshots
    .filter((snapshot) => new Date(snapshot.timestamp) >= startDate)
    .forEach((snapshot) => {
      const date = new Date(snapshot.timestamp)
      const month = date.getMonth()
      const year = date.getFullYear()
      const key = `${year}-${month}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: getMonthName(month),
          monthNumber: month,
          year,
          totalEmissions: 0,
        }
      }

      monthlyData[key].totalEmissions += snapshot.metadata.totalEmissions
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
    }))
}
