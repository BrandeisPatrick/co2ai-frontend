import { Equipment, JSONBinExperiment } from '../../types'

export interface TimeSeriesDataPoint {
  timestamp: Date
  equipment: Equipment
  originalExperiment: JSONBinExperiment
}

export interface TimeSeriesSnapshot {
  date: Date
  equipment: Equipment[]
  equipmentCount: number
}

export interface DailyAggregate {
  date: string
  emissions: number
}

export interface WeeklyAggregate {
  name: string
  emissions: number
  equipmentCount: number
}

export interface MonthlyAggregate {
  name: string
  emissions: number
}

export interface AggregatedData {
  week: number
  year: number
  totalEmissions: number
  equipmentCount: number
}

export interface MonthlyAggregatedData {
  month: string
  monthNumber: number
  year: number
  totalEmissions: number
}
