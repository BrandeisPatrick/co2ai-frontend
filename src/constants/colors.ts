// Chart Colors
export const CHART_COLORS = {
  primary: '#ef4444',
  secondary: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  orange: '#f97316',
  gradient: {
    emissions: {
      start: { offset: '5%', color: '#ef4444', opacity: 0.3 },
      end: { offset: '95%', color: '#ef4444', opacity: 0 },
    },
  },
} as const

// Top equipment chart colors (in order of ranking)
export const TOP_EQUIPMENT_COLORS = [
  '#ef4444', // red - highest
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue - lowest
] as const
