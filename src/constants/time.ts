// Time Intervals (in milliseconds)
export const TIME_INTERVALS = {
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
} as const

// History Configuration
export const HISTORY_CONFIG = {
  DAYS_OF_HISTORY: 90,
  DEFAULT_DAILY_RANGE: 30,
  DEFAULT_WEEKLY_RANGE: 12,
  DEFAULT_MONTHLY_RANGE: 12,
} as const

// Month Names
export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

// Variation Factors for Mock Data
export const VARIATION_FACTORS = {
  WEEKEND_FACTOR: 0.7,
  WEEKDAY_FACTOR: 1.0,
  RANDOM_MIN: 0.85,
  RANDOM_RANGE: 0.3,
  TREND_FACTOR: 0.1,
} as const
