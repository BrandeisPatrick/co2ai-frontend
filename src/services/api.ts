import { DashboardData, Equipment, JSONBinExperiment } from '../types'

// Mock equipment data - comprehensive lab equipment
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'ULT Freezer -80°C',
    equipmentId: '#001',
    manufacturer: 'Thermo Fisher Scientific',
    type: 'Ultra-Low Freezer',
    status: 'active',
    powerDraw: { value: 5.2, unit: 'kW' },
    dailyEmissions: { value: 120, unit: 'kgCO₂e' }
  },
  {
    id: '2',
    name: 'CO2 Incubator Pro',
    equipmentId: '#002',
    manufacturer: 'Esco Technologies',
    type: 'CO2 Incubator',
    status: 'active',
    powerDraw: { value: 2.8, unit: 'kW' },
    dailyEmissions: { value: 65, unit: 'kgCO₂e' }
  },
  {
    id: '3',
    name: 'Biosafety Cabinet Class II',
    equipmentId: '#003',
    manufacturer: 'Nuaire',
    type: 'Biosafety Cabinet',
    status: 'active',
    powerDraw: { value: 1.5, unit: 'kW' },
    dailyEmissions: { value: 35, unit: 'kgCO₂e' }
  },
  {
    id: '4',
    name: 'Autoclave Sterilizer',
    equipmentId: '#004',
    manufacturer: 'MELAG',
    type: 'Autoclave',
    status: 'active',
    powerDraw: { value: 3.2, unit: 'kW' },
    dailyEmissions: { value: 75, unit: 'kgCO₂e' }
  },
  {
    id: '5',
    name: 'Real-Time PCR System',
    equipmentId: '#005',
    manufacturer: 'Applied Biosystems',
    type: 'PCR Machine',
    status: 'active',
    powerDraw: { value: 1.2, unit: 'kW' },
    dailyEmissions: { value: 28, unit: 'kgCO₂e' }
  },
  {
    id: '6',
    name: 'High-Speed Microcentrifuge',
    equipmentId: '#006',
    manufacturer: 'Eppendorf',
    type: 'Centrifuge',
    status: 'idle',
    powerDraw: { value: 0.8, unit: 'kW' },
    dailyEmissions: { value: 18, unit: 'kgCO₂e' }
  },
  {
    id: '7',
    name: 'Inverted Fluorescence Microscope',
    equipmentId: '#007',
    manufacturer: 'Olympus',
    type: 'Microscope',
    status: 'active',
    powerDraw: { value: 0.6, unit: 'kW' },
    dailyEmissions: { value: 14, unit: 'kgCO₂e' }
  },
  {
    id: '8',
    name: 'UV-Vis Spectrophotometer',
    equipmentId: '#008',
    manufacturer: 'Shimadzu',
    type: 'Spectrophotometer',
    status: 'active',
    powerDraw: { value: 0.4, unit: 'kW' },
    dailyEmissions: { value: 9, unit: 'kgCO₂e' }
  },
  {
    id: '9',
    name: 'Ultra-Low Freezer -80°C (2nd Unit)',
    equipmentId: '#009',
    manufacturer: 'Thermo Fisher Scientific',
    type: 'Ultra-Low Freezer',
    status: 'active',
    powerDraw: { value: 5.1, unit: 'kW' },
    dailyEmissions: { value: 118, unit: 'kgCO₂e' }
  },
  {
    id: '10',
    name: 'CO2 Incubator Standard',
    equipmentId: '#010',
    manufacturer: 'Panasonic',
    type: 'CO2 Incubator',
    status: 'active',
    powerDraw: { value: 2.5, unit: 'kW' },
    dailyEmissions: { value: 58, unit: 'kgCO₂e' }
  },
  {
    id: '11',
    name: 'Benchtop Centrifuge',
    equipmentId: '#011',
    manufacturer: 'Heraeus',
    type: 'Centrifuge',
    status: 'maintenance',
    powerDraw: { value: 1.0, unit: 'kW' },
    dailyEmissions: { value: 23, unit: 'kgCO₂e' }
  },
  {
    id: '12',
    name: 'Liquid Nitrogen Tank',
    equipmentId: '#012',
    manufacturer: 'Chart Industries',
    type: 'Ultra-Low Freezer',
    status: 'active',
    powerDraw: { value: 2.0, unit: 'kW' },
    dailyEmissions: { value: 46, unit: 'kgCO₂e' }
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch data from secure backend API
 */
async function fetchEquipmentData(): Promise<JSONBinExperiment[]> {
  try {
    const response = await fetch('/api/equipment', {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error('API returned error')
    }

    return result.data
  } catch (error) {
    console.error('Failed to fetch equipment data:', error)
    // Return empty array on error
    return []
  }
}

/**
 * Transform JSONBin experiment data to Equipment format
 */
function transformExperimentToEquipment(experiment: JSONBinExperiment): Equipment {
  // Extract hardware name (use GPU or CPU)
  const hardwareName = experiment.GPU_name || experiment.CPU_name

  // Convert kWh to kW (assuming 24-hour operation)
  const powerDrawKw = experiment['power_consumption(kWh)'] * 24

  // Convert kg to kgCO₂e for daily emissions
  const dailyEmissionsKg = experiment['CO2_emissions(kg)'] * 24

  return {
    id: experiment.id,
    name: hardwareName.split('/')[0].trim(), // Get just the hardware name
    equipmentId: `#${experiment.id.substring(0, 6)}`,
    manufacturer: experiment.GPU_name ? 'NVIDIA' : 'Intel',
    type: experiment.GPU_name ? 'GPU' : 'CPU',
    status: 'active',
    powerDraw: {
      value: parseFloat(powerDrawKw.toFixed(4)),
      unit: 'kW'
    },
    dailyEmissions: {
      value: parseFloat(dailyEmissionsKg.toFixed(4)),
      unit: 'kgCO₂e'
    }
  }
}

export const apiService = {
  /**
   * Fetch dashboard data
   * Replace this with actual API call:
   * return fetch('/api/dashboard').then(res => res.json())
   */
  async getDashboardData(): Promise<DashboardData> {
    await delay(500) // Simulate network delay

    // Get actual equipment
    const equipment = await this.getEquipment()
    const activeCount = equipment.filter(e => e.status === 'active').length

    // Calculate Total Emissions (sum of daily emissions in kgCO₂e, convert to tCO₂e)
    const totalEmissionsKg = equipment.reduce((sum, item) => {
      return sum + item.dailyEmissions.value
    }, 0)
    const totalEmissionsTons = totalEmissionsKg / 1000

    // Calculate Monthly Consumption (sum of power draw * 24 hours * 30 days, convert to MWh)
    const monthlyConsumptionKWh = equipment.reduce((sum, item) => {
      return sum + (item.powerDraw.value * 24 * 30)
    }, 0)
    const monthlyConsumptionMWh = monthlyConsumptionKWh / 1000

    // Get current month for trend chart
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' })

    // Generate top equipment chart (sorted by daily emissions, top 5)
    const topEquipment = equipment
      .sort((a, b) => b.dailyEmissions.value - a.dailyEmissions.value)
      .slice(0, 5)
      .map((item, index) => {
        const colors = ['#60A5FA', '#C084FC', '#34D399', '#FB923C', '#4ADE80']
        return {
          name: item.name,
          emissions: item.dailyEmissions.value,
          color: colors[index] || '#60A5FA'
        }
      })

    // Return dashboard data with real calculations
    return {
      emissions: {
        total: parseFloat(totalEmissionsTons.toFixed(2)),
        unit: 'tCO₂e',
        percentageChange: 0,
        changeType: 'decrease'
      },
      activeEquipment: {
        count: activeCount,
        percentageChange: 0,
        changeType: 'increase'
      },
      efficiency: {
        score: 0,
        maxScore: 100,
        percentageChange: 0,
        changeType: 'increase',
        improvement: false
      },
      monthlyConsumption: {
        value: parseFloat(monthlyConsumptionMWh.toFixed(2)),
        unit: 'MWh',
        percentageChange: 0,
        changeType: 'decrease'
      },
      monthlyTrend: [
        { month: currentMonth, emissions: parseFloat(totalEmissionsTons.toFixed(2)) }
      ],
      topEquipment: topEquipment,
      alerts: [] // No alerts - not yet implemented
    }
  },

  /**
   * Fetch equipment inventory from JSONBin
   * Fetches real experiment data and transforms it to equipment format
   */
  async getEquipment(): Promise<Equipment[]> {
    try {
      // Fetch data from secure backend API
      const experiments = await fetchEquipmentData()

      // Transform experiments to equipment
      const equipment = experiments.map(transformExperimentToEquipment)

      // Merge with any manually added equipment (from mockEquipment if they were added via addEquipment)
      const manuallyAdded = mockEquipment.filter(e =>
        !equipment.some(exp => exp.id === e.id)
      )

      return [...equipment, ...manuallyAdded]
    } catch (error) {
      console.error('Failed to get equipment:', error)
      // Fallback to mock data on error
      return mockEquipment
    }
  },

  /**
   * Add new equipment
   * Replace this with actual API call:
   * return fetch('/api/equipment', { method: 'POST', body: JSON.stringify(equipment) })
   */
  async addEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    await delay(500) // Simulate network delay

    // Generate a new ID
    const newId = (mockEquipment.length + 1).toString()
    const newEquipment: Equipment = {
      ...equipment,
      id: newId
    }

    // Add to mock data
    mockEquipment.push(newEquipment)

    return newEquipment
  },

  /**
   * Fetch analytics data for charts
   */
  async getAnalyticsData(): Promise<{
    week: Array<{ name: string; emissions: number; consumption: number }>
    month: Array<{ name: string; emissions: number; consumption: number }>
    year: Array<{ name: string; emissions: number; consumption: number }>
  }> {
    try {
      const equipment = await this.getEquipment()

      if (equipment.length === 0) {
        throw new Error('No equipment data available')
      }

      // Calculate average daily values from equipment
      const avgDailyEmissions =
        equipment.reduce((sum, e) => sum + e.dailyEmissions.value, 0) /
        equipment.length
      const avgDailyConsumption =
        equipment.reduce((sum, e) => sum + e.powerDraw.value * 24, 0) /
        equipment.length // kW * 24 hours = kWh

      // Generate week data (7 days with variation)
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const variation = 0.8 + Math.random() * 0.4 // 0.8 to 1.2 variation
        return {
          name: days[i],
          emissions: parseFloat((avgDailyEmissions * variation).toFixed(1)),
          consumption: parseFloat(
            (avgDailyConsumption * variation).toFixed(0)
          )
        }
      })

      // Generate month data (4 weeks)
      const monthData = Array.from({ length: 4 }, (_, i) => {
        const variation = 0.85 + Math.random() * 0.3
        const weekEmissions = weekData.reduce((sum, d) => sum + d.emissions, 0)
        const weekConsumption = weekData.reduce(
          (sum, d) => sum + d.consumption,
          0
        )
        return {
          name: `Week ${i + 1}`,
          emissions: parseFloat((weekEmissions * variation).toFixed(0)),
          consumption: parseFloat((weekConsumption * variation).toFixed(0))
        }
      })

      // Generate year data (12 months)
      const yearData = Array.from({ length: 12 }, (_, i) => {
        const months = [
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
        const variation = 0.9 + Math.random() * 0.2
        const monthEmissions = monthData.reduce((sum, d) => sum + d.emissions, 0)
        const monthConsumption = monthData.reduce(
          (sum, d) => sum + d.consumption,
          0
        )
        return {
          name: months[i],
          emissions: parseFloat((monthEmissions * variation).toFixed(0)),
          consumption: parseFloat((monthConsumption * variation).toFixed(0))
        }
      })

      return { week: weekData, month: monthData, year: yearData }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      // Return empty data structure on error
      return {
        week: [],
        month: [],
        year: []
      }
    }
  },

  /**
   * Example of how to structure a real API call:
   */
  // async getDashboardData(): Promise<DashboardData> {
  //   const response = await fetch('/api/dashboard', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Add authentication headers if needed
  //       // 'Authorization': `Bearer ${token}`
  //     }
  //   })
  //
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch dashboard data')
  //   }
  //
  //   return response.json()
  // }
}
