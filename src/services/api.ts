import { DashboardData, Equipment, TimestampedEquipmentSnapshot } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { TOP_EQUIPMENT_COLORS } from '../constants'
import {
  getLatestSnapshot,
  getAllSnapshots,
  getWeeklyAggregates,
  getMonthlyAggregates,
} from './data/timestampedDataSource'

// Helper to map DB equipment to app equipment
function mapDbToEquipment(record: any): Equipment {
  return {
    id: record.id,
    name: record.name,
    equipmentId: record.equipment_id || '',
    manufacturer: record.manufacturer,
    type: record.type,
    dailyEmissions: {
      value: Number(record.daily_emissions_value),
      unit: record.daily_emissions_unit || 'kgCO₂e',
    },
    category: record.category,
    image: record.image_url || undefined,
  }
}

// Simulate API delay for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiService = {
  /**
   * Get all equipment for an organization (Supabase) or mock data
   */
  async getEquipment(organizationId?: string): Promise<Equipment[]> {
    if (isSupabaseConfigured && organizationId) {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(mapDbToEquipment)
    }

    // Fallback to mock data
    await delay(500)
    const snapshot = getLatestSnapshot()
    return snapshot.equipment
  },

  /**
   * Get all timestamped snapshots (mock data only for now)
   */
  async getSnapshots(): Promise<TimestampedEquipmentSnapshot[]> {
    await delay(500)
    return getAllSnapshots()
  },

  /**
   * Add new equipment
   */
  async addEquipment(
    equipment: Omit<Equipment, 'id'>,
    organizationId?: string
  ): Promise<Equipment> {
    if (isSupabaseConfigured && organizationId) {
      const { data, error } = await supabase
        .from('equipment')
        .insert({
          organization_id: organizationId,
          name: equipment.name,
          equipment_id: equipment.equipmentId,
          manufacturer: equipment.manufacturer,
          type: equipment.type,
          daily_emissions_value: equipment.dailyEmissions.value,
          daily_emissions_unit: equipment.dailyEmissions.unit,
          category: equipment.category,
        })
        .select()
        .single()

      if (error) throw error
      return mapDbToEquipment(data)
    }

    // Fallback to mock
    await delay(500)
    return {
      ...equipment,
      id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  },

  /**
   * Update equipment
   */
  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<void> {
    if (isSupabaseConfigured) {
      const dbUpdates: Record<string, any> = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.equipmentId !== undefined) dbUpdates.equipment_id = updates.equipmentId
      if (updates.manufacturer !== undefined) dbUpdates.manufacturer = updates.manufacturer
      if (updates.type !== undefined) dbUpdates.type = updates.type
      if (updates.dailyEmissions !== undefined) {
        dbUpdates.daily_emissions_value = updates.dailyEmissions.value
        dbUpdates.daily_emissions_unit = updates.dailyEmissions.unit
      }
      if (updates.category !== undefined) dbUpdates.category = updates.category

      const { error } = await supabase.from('equipment').update(dbUpdates).eq('id', id)
      if (error) throw error
      return
    }

    await delay(500)
  },

  /**
   * Delete equipment (soft delete)
   */
  async deleteEquipment(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('equipment')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      return
    }

    await delay(500)
  },

  /**
   * Get historical data aggregates from Supabase
   */
  async getHistoricalData(organizationId: string) {
    if (!isSupabaseConfigured) {
      return null
    }

    const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
      supabase.rpc('get_daily_aggregates', {
        p_organization_id: organizationId,
        p_days: 30,
      }),
      supabase.rpc('get_weekly_aggregates', {
        p_organization_id: organizationId,
        p_weeks: 12,
      }),
      supabase.rpc('get_monthly_aggregates', {
        p_organization_id: organizationId,
        p_months: 12,
      }),
    ])

    return {
      daily:
        dailyRes.data?.map((d: any) => ({
          date: d.date,
          emissions: Number(d.total_emissions),
        })) || [],
      weekly:
        weeklyRes.data?.map((w: any) => ({
          name: w.week_name,
          emissions: Number(w.total_emissions),
          equipmentCount: Number(w.equipment_count),
        })) || [],
      monthly:
        monthlyRes.data?.map((m: any) => ({
          name: m.month_name,
          emissions: Number(m.total_emissions),
        })) || [],
    }
  },

  /**
   * Get dashboard data derived from latest snapshot or Supabase
   */
  async getDashboardData(organizationId?: string): Promise<DashboardData> {
    // Try to get from Supabase if configured
    if (isSupabaseConfigured && organizationId) {
      const [equipment, historicalData] = await Promise.all([
        this.getEquipment(organizationId),
        this.getHistoricalData(organizationId),
      ])

      if (historicalData && historicalData.daily.length > 0) {
        // Calculate from Supabase data
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

        const currentMonthEmissions = historicalData.daily
          .filter((d: any) => d.date.startsWith(currentMonth))
          .reduce((sum: number, d: any) => sum + d.emissions, 0)

        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
        const prevMonthEmissions = historicalData.daily
          .filter((d: any) => d.date.startsWith(prevMonth))
          .reduce((sum: number, d: any) => sum + d.emissions, 0)

        const emissionsChange =
          prevMonthEmissions !== 0
            ? ((currentMonthEmissions - prevMonthEmissions) / prevMonthEmissions) * 100
            : 0

        const topEquipment = equipment
          .sort((a, b) => b.dailyEmissions.value - a.dailyEmissions.value)
          .slice(0, 5)
          .map((eq, idx) => ({
            name: eq.name,
            emissions: eq.dailyEmissions.value,
            color: TOP_EQUIPMENT_COLORS[idx] || '#60A5FA',
          }))

        return {
          emissions: {
            total: parseFloat((currentMonthEmissions / 1000).toFixed(2)),
            unit: 'tCO₂e',
            percentageChange: Math.round(emissionsChange),
            changeType: emissionsChange >= 0 ? 'increase' : 'decrease',
          },
          activeEquipment: {
            count: equipment.length,
            percentageChange: 0,
            changeType: 'increase',
          },
          monthlyTrend: historicalData.monthly.map((m: any) => ({
            month: m.name,
            emissions: m.emissions,
          })),
          topEquipment,
        }
      }
    }

    // Fallback to mock data
    await delay(500)

    const snapshot = getLatestSnapshot()
    const equipment = snapshot.equipment

    const totalEmissionsKg = snapshot.metadata.totalEmissions
    const totalEmissionsTons = totalEmissionsKg / 1000

    const monthlyData = getMonthlyAggregates(1)
    const currentMonthEmissions = monthlyData.length > 0 ? monthlyData[0].emissions : totalEmissionsKg

    const previousMonthData = getMonthlyAggregates(2)
    const previousMonthEmissions =
      previousMonthData.length > 1 ? previousMonthData[0].emissions : currentMonthEmissions

    const emissionsChange =
      previousMonthEmissions !== 0
        ? ((currentMonthEmissions - previousMonthEmissions) / previousMonthEmissions) * 100
        : 0

    const weeklyData = getWeeklyAggregates(2)
    const currentWeekEquipment =
      weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].equipmentCount : equipment.length
    const previousWeekEquipment =
      weeklyData.length > 1 ? weeklyData[weeklyData.length - 2].equipmentCount : equipment.length
    const equipmentChange =
      previousWeekEquipment !== 0
        ? ((currentWeekEquipment - previousWeekEquipment) / previousWeekEquipment) * 100
        : 0

    const topEquipment = equipment
      .sort((a, b) => b.dailyEmissions.value - a.dailyEmissions.value)
      .slice(0, 5)
      .map((item, index) => ({
        name: item.name,
        emissions: item.dailyEmissions.value,
        color: TOP_EQUIPMENT_COLORS[index] || '#60A5FA',
      }))

    const monthlyTrend = getMonthlyAggregates(12)

    return {
      emissions: {
        total: parseFloat(totalEmissionsTons.toFixed(2)),
        unit: 'tCO₂e',
        percentageChange: Math.round(emissionsChange),
        changeType: emissionsChange >= 0 ? 'increase' : 'decrease',
      },
      activeEquipment: {
        count: equipment.length,
        percentageChange: Math.round(equipmentChange),
        changeType: equipmentChange >= 0 ? 'increase' : 'decrease',
      },
      monthlyTrend: monthlyTrend.map((month) => ({
        month: month.name,
        emissions: month.emissions,
      })),
      topEquipment,
    }
  },
}
