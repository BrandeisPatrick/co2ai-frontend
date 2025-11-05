/**
 * Time series utility functions for consistent data calculations across Dashboard and Analytics
 */

export interface DailyDataPoint {
  date: string
  emissions: number
  consumption: number
}

export interface MonthlyDataPoint {
  name: string
  emissions: number
  consumption: number
}

/**
 * Get the current calendar month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Get the previous calendar month in YYYY-MM format
 */
export const getPreviousMonth = (): string => {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Extract month from date string (YYYY-MM-DD format)
 */
export const getMonthFromDate = (dateString: string): string => {
  return dateString.substring(0, 7) // Returns YYYY-MM
}

/**
 * Get daily data for current calendar month
 */
export const getCurrentMonthData = (dailyData: DailyDataPoint[]): DailyDataPoint[] => {
  const currentMonth = getCurrentMonth()
  return dailyData.filter(
    (day) => getMonthFromDate(day.date) === currentMonth
  )
}

/**
 * Get daily data for previous calendar month
 */
export const getPreviousMonthData = (dailyData: DailyDataPoint[]): DailyDataPoint[] => {
  const previousMonth = getPreviousMonth()
  return dailyData.filter(
    (day) => getMonthFromDate(day.date) === previousMonth
  )
}

/**
 * Get last N days of daily data
 */
export const getLastNDays = (dailyData: DailyDataPoint[], days: number): DailyDataPoint[] => {
  return dailyData.slice(-days)
}

/**
 * Sum consumption values from daily data
 */
export const sumConsumption = (dailyData: DailyDataPoint[]): number => {
  return dailyData.reduce((sum, day) => sum + day.consumption, 0)
}

/**
 * Sum emissions values from daily data
 */
export const sumEmissions = (dailyData: DailyDataPoint[]): number => {
  return dailyData.reduce((sum, day) => sum + day.emissions, 0)
}

/**
 * Calculate average daily consumption
 */
export const avgDailyConsumption = (dailyData: DailyDataPoint[]): number => {
  if (dailyData.length === 0) return 0
  return sumConsumption(dailyData) / dailyData.length
}

/**
 * Calculate average daily emissions
 */
export const avgDailyEmissions = (dailyData: DailyDataPoint[]): number => {
  if (dailyData.length === 0) return 0
  return sumEmissions(dailyData) / dailyData.length
}

/**
 * Convert kWh to MWh
 */
export const kWhToMWh = (kWh: number): number => {
  return kWh / 1000
}

/**
 * Convert kgCO2e to tCO2e
 */
export const kgToTons = (kg: number): number => {
  return kg / 1000
}

/**
 * Format consumption value with appropriate unit
 */
export const formatConsumption = (kWh: number): { value: number; unit: string } => {
  if (kWh >= 1000) {
    return {
      value: parseFloat(kWhToMWh(kWh).toFixed(2)),
      unit: 'MWh'
    }
  }
  return {
    value: parseFloat(kWh.toFixed(2)),
    unit: 'kWh'
  }
}

/**
 * Format emissions value with appropriate unit
 */
export const formatEmissions = (kg: number): { value: number; unit: string } => {
  if (kg >= 1000) {
    return {
      value: parseFloat(kgToTons(kg).toFixed(2)),
      unit: 'tCO2e'
    }
  }
  return {
    value: parseFloat(kg.toFixed(2)),
    unit: 'kgCO₂e'
  }
}

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): { change: number; type: 'increase' | 'decrease' } => {
  if (previous === 0) {
    return { change: 0, type: 'increase' }
  }
  const change = ((current - previous) / previous) * 100
  return {
    change: Math.abs(change),
    type: change >= 0 ? 'increase' : 'decrease'
  }
}
