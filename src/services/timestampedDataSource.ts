import { Equipment, TimestampedEquipmentSnapshot } from '../types'

/**
 * Base equipment data for snapshots
 */
const baseEquipment: Equipment[] = [
  {
    id: '1',
    name: 'ULT Freezer -80°C',
    equipmentId: '#001',
    manufacturer: 'Thermo Fisher Scientific',
    type: 'Ultra-Low Freezer',
    dailyEmissions: { value: 120, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '2',
    name: 'CO2 Incubator Pro',
    equipmentId: '#002',
    manufacturer: 'Esco Technologies',
    type: 'CO2 Incubator',
    dailyEmissions: { value: 65, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '3',
    name: 'Biosafety Cabinet Class II',
    equipmentId: '#003',
    manufacturer: 'Nuaire',
    type: 'Biosafety Cabinet',
    dailyEmissions: { value: 35, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '4',
    name: 'Autoclave Sterilizer',
    equipmentId: '#004',
    manufacturer: 'MELAG',
    type: 'Autoclave',
    dailyEmissions: { value: 75, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '5',
    name: 'Real-Time PCR System',
    equipmentId: '#005',
    manufacturer: 'Applied Biosystems',
    type: 'PCR Machine',
    dailyEmissions: { value: 28, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '6',
    name: 'High-Speed Microcentrifuge',
    equipmentId: '#006',
    manufacturer: 'Eppendorf',
    type: 'Centrifuge',
    dailyEmissions: { value: 18, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '7',
    name: 'Inverted Fluorescence Microscope',
    equipmentId: '#007',
    manufacturer: 'Olympus',
    type: 'Microscope',
    dailyEmissions: { value: 14, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '8',
    name: 'UV-Vis Spectrophotometer',
    equipmentId: '#008',
    manufacturer: 'Shimadzu',
    type: 'Spectrophotometer',
    dailyEmissions: { value: 9, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '9',
    name: 'Ultra-Low Freezer -80°C (2nd Unit)',
    equipmentId: '#009',
    manufacturer: 'Thermo Fisher Scientific',
    type: 'Ultra-Low Freezer',
    dailyEmissions: { value: 118, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '10',
    name: 'CO2 Incubator Standard',
    equipmentId: '#010',
    manufacturer: 'Panasonic',
    type: 'CO2 Incubator',
    dailyEmissions: { value: 58, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '11',
    name: 'Benchtop Centrifuge',
    equipmentId: '#011',
    manufacturer: 'Heraeus',
    type: 'Centrifuge',
    dailyEmissions: { value: 23, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '12',
    name: 'Liquid Nitrogen Tank',
    equipmentId: '#012',
    manufacturer: 'Chart Industries',
    type: 'Ultra-Low Freezer',
    dailyEmissions: { value: 46, unit: 'kgCO₂e' },
    category: 'wet-lab'
  },
  {
    id: '13',
    name: 'NVIDIA Tesla T4',
    equipmentId: '#013',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 45, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '14',
    name: 'NVIDIA A100 80GB',
    equipmentId: '#014',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 85, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '15',
    name: 'NVIDIA V100 32GB',
    equipmentId: '#015',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 72, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '16',
    name: 'NVIDIA H100 80GB',
    equipmentId: '#016',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 110, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '17',
    name: 'NVIDIA RTX A6000',
    equipmentId: '#017',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 55, unit: 'kgCO₂e' },
    category: 'dry-lab'
  },
  {
    id: '18',
    name: 'NVIDIA L40',
    equipmentId: '#018',
    manufacturer: 'NVIDIA',
    type: 'GPU Accelerator',
    dailyEmissions: { value: 62, unit: 'kgCO₂e' },
    category: 'dry-lab'
  }
]

/**
 * Generate timestamped snapshots with realistic variations
 * Creates 90 days of historical data with daily variations
 */
export function generateTimestampedSnapshots(): TimestampedEquipmentSnapshot[] {
  const snapshots: TimestampedEquipmentSnapshot[] = []
  const DAYS_OF_HISTORY = 90

  for (let daysAgo = DAYS_OF_HISTORY; daysAgo >= 0; daysAgo--) {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(0, 0, 0, 0)

    const dayOfWeek = date.getDay()
    const timestamp = date.toISOString()
    const snapshotId = `snap_${date.toISOString().split('T')[0]}`

    // Apply variations to equipment
    const snapshotEquipment = baseEquipment.map((eq) => {
      // Weekend factor (0.7 on weekends, 1.0 on weekdays)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const weekendFactor = isWeekend ? 0.7 : 1.0

      // Seasonal trend (slight increase over time)
      const trendFactor = 1.0 + (DAYS_OF_HISTORY - daysAgo) / DAYS_OF_HISTORY * 0.1

      // Random natural variation (±15%)
      const randomVariation = 0.85 + Math.random() * 0.3

      // Combined factor
      const combinedFactor = weekendFactor * trendFactor * randomVariation

      return {
        ...eq,
        dailyEmissions: {
          ...eq.dailyEmissions,
          value: Number((eq.dailyEmissions.value * combinedFactor).toFixed(2))
        }
      }
    })

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
        dataSource: 'mock'
      }
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
export function getDailyAggregates(days: number = 30) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  return snapshots
    .filter((snapshot) => new Date(snapshot.timestamp) >= startDate)
    .map((snapshot) => ({
      date: snapshot.timestamp.split('T')[0],
      emissions: snapshot.metadata.totalEmissions
    }))
}

/**
 * Get weekly aggregates for charts
 */
export function getWeeklyAggregates(weeks: number = 12) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - weeks * 7)
  startDate.setHours(0, 0, 0, 0)

  const weeklyData: {
    [key: string]: {
      week: number
      year: number
      totalEmissions: number
      equipmentCount: number
    }
  } = {}

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
          equipmentCount: snapshot.metadata.totalEquipmentCount
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
      equipmentCount: weekly.equipmentCount
    }))
}

/**
 * Get monthly aggregates for charts
 */
export function getMonthlyAggregates(months: number = 12) {
  const snapshots = generateTimestampedSnapshots()
  const now = new Date()
  const startDate = new Date(now)
  startDate.setMonth(startDate.getMonth() - months)
  startDate.setDate(1)
  startDate.setHours(0, 0, 0, 0)

  const monthlyData: {
    [key: string]: {
      month: string
      monthNumber: number
      year: number
      totalEmissions: number
    }
  } = {}

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  snapshots
    .filter((snapshot) => new Date(snapshot.timestamp) >= startDate)
    .forEach((snapshot) => {
      const date = new Date(snapshot.timestamp)
      const month = date.getMonth()
      const year = date.getFullYear()
      const key = `${year}-${month}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: monthNames[month],
          monthNumber: month,
          year,
          totalEmissions: 0
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
      emissions: Math.round(monthly.totalEmissions)
    }))
}

/**
 * Get week number from date
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
