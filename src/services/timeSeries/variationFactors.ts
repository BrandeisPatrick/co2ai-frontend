import { Equipment } from '../../types'
import { VARIATION_FACTORS, HISTORY_CONFIG } from '../../constants'
import { isWeekend } from './dateUtils'

/**
 * Apply realistic daily variations to equipment data
 * Only applies daily-level variations (weekend, seasonal, random)
 */
export function applyDailyVariations(
  equipment: Equipment,
  date: Date,
  daysAgo: number
): Equipment {
  // Weekend factor (0.7 on weekends, 1.0 on weekdays)
  const weekendFactor = isWeekend(date)
    ? VARIATION_FACTORS.WEEKEND_FACTOR
    : VARIATION_FACTORS.WEEKDAY_FACTOR

  // Seasonal trend (slight increase over time)
  const trendFactor =
    1.0 +
    ((HISTORY_CONFIG.DAYS_OF_HISTORY - daysAgo) / HISTORY_CONFIG.DAYS_OF_HISTORY) *
      VARIATION_FACTORS.TREND_FACTOR

  // Random natural variation (±15%)
  const randomVariation =
    VARIATION_FACTORS.RANDOM_MIN + Math.random() * VARIATION_FACTORS.RANDOM_RANGE

  // Combined factor
  const combinedFactor = weekendFactor * trendFactor * randomVariation

  return {
    ...equipment,
    dailyEmissions: {
      ...equipment.dailyEmissions,
      value: Number((equipment.dailyEmissions.value * combinedFactor).toFixed(2)),
    },
  }
}

/**
 * Calculate combined variation factor for a given day
 */
export function calculateVariationFactor(date: Date, daysAgo: number): number {
  const weekendFactor = isWeekend(date)
    ? VARIATION_FACTORS.WEEKEND_FACTOR
    : VARIATION_FACTORS.WEEKDAY_FACTOR

  const trendFactor =
    1.0 +
    ((HISTORY_CONFIG.DAYS_OF_HISTORY - daysAgo) / HISTORY_CONFIG.DAYS_OF_HISTORY) *
      VARIATION_FACTORS.TREND_FACTOR

  const randomVariation =
    VARIATION_FACTORS.RANDOM_MIN + Math.random() * VARIATION_FACTORS.RANDOM_RANGE

  return weekendFactor * trendFactor * randomVariation
}
