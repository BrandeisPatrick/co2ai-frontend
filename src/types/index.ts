export interface EmissionsData {
  total: number;
  unit: string;
  percentageChange: number;
  changeType: 'increase' | 'decrease';
}

export interface ActiveEquipment {
  count: number;
  percentageChange: number;
  changeType: 'increase' | 'decrease';
}

export interface EfficiencyScore {
  score: number;
  maxScore: number;
  percentageChange: number;
  changeType: 'increase' | 'decrease';
  improvement: boolean;
}

export interface MonthlyConsumption {
  value: number;
  unit: string;
  percentageChange: number;
  changeType: 'increase' | 'decrease';
}

export interface MonthlyEmissionPoint {
  month: string;
  emissions: number;
}

export interface EquipmentEmission {
  name: string;
  emissions: number;
  color: string;
}

export interface Alert {
  id: string;
  type: 'maintenance' | 'optimization';
  title: string;
  equipment: string;
  equipmentId: string;
  description: string;
  potentialSavings?: string;
  actionLabel: string;
}

export interface DashboardData {
  emissions: EmissionsData;
  activeEquipment: ActiveEquipment;
  efficiency: EfficiencyScore;
  monthlyConsumption: MonthlyConsumption;
  monthlyTrend: MonthlyEmissionPoint[];
  topEquipment: EquipmentEmission[];
  alerts: Alert[];
}

// Equipment Inventory Types
export type EquipmentStatus = 'active' | 'idle' | 'maintenance' | 'offline' | 'faulty';
export type EquipmentCategory = 'wet-lab' | 'dry-lab';

export type EquipmentType =
  | 'Ultra-Low Freezer'
  | 'CO2 Incubator'
  | 'Biosafety Cabinet'
  | 'Autoclave'
  | 'PCR Machine'
  | 'Centrifuge'
  | 'Microscope'
  | 'Spectrophotometer'
  | 'GPU'
  | 'CPU';

export interface Equipment {
  id: string;
  name: string;
  equipmentId: string;
  manufacturer: string;
  type: EquipmentType;
  status: EquipmentStatus;
  powerDraw: {
    value: number;
    unit: string;
  };
  dailyEmissions: {
    value: number;
    unit: string;
  };
  image?: string;
  errorMessage?: string;
  category?: EquipmentCategory;
}

// JSONBin Data Types
export interface JSONBinExperiment {
  id: string;
  project_name: string;
  experiment_description: string;
  epoch: number | null;
  start_time: string;
  'duration(s)': number;
  'power_consumption(kWh)': number;
  'CO2_emissions(kg)': number;
  CPU_name: string;
  GPU_name: string;
  OS: string;
  'region/country': string;
  cost: number;
}

export interface JSONBinMetadata {
  id: string;
  private: boolean;
  createdAt: string;
}

export interface JSONBinResponse {
  record: JSONBinExperiment[];
  metadata: JSONBinMetadata;
}
