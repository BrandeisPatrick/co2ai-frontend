import { DashboardData, Equipment, JSONBinExperiment } from '../types'

// Mock equipment data - single demo equipment
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'ULT Freezer -80°C',
    equipmentId: '#001',
    manufacturer: 'Thermo Fisher Scientific',
    type: 'Ultra-Low Freezer',
    status: 'active',
    powerDraw: { value: 5, unit: 'kW' },
    dailyEmissions: { value: 120, unit: 'kgCO₂e' }
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
