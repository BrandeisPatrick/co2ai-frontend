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
  monthlyConsumption: MonthlyConsumption;
  monthlyTrend: MonthlyEmissionPoint[];
  topEquipment: EquipmentEmission[];
}

// Equipment Inventory Types
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
  powerDraw: {
    value: number;
    unit: string;
  };
  dailyEmissions: {
    value: number;
    unit: string;
  };
  image?: string;
  category?: EquipmentCategory;
}

// Timestamped Data Source Types
export interface SnapshotMetadata {
  totalEquipmentCount: number;
  totalEmissions: number;
  totalPowerDraw: number;
  dataSource: 'mock' | 'api' | 'manual';
}

export interface TimestampedEquipmentSnapshot {
  timestamp: string;
  snapshotId: string;
  equipment: Equipment[];
  metadata: SnapshotMetadata;
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
