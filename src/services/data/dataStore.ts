import { Equipment, JSONBinExperiment, TimestampedEquipmentSnapshot } from '@/types';

export interface HistoricalData {
  daily: Array<{ date: string; emissions: number }>;
  weekly: Array<{ name: string; emissions: number; equipmentCount: number }>;
  monthly: Array<{ name: string; emissions: number }>;
}

export interface DataStore {
  organizationId: string | null;
  snapshots: TimestampedEquipmentSnapshot[];
  currentSnapshot: TimestampedEquipmentSnapshot | null;
  equipment: Equipment[];
  rawExperiments: JSONBinExperiment[];
  historicalData: HistoricalData;
  lastSyncTime: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface DataStoreActions {
  setEquipment: (equipment: Equipment[]) => void;
  setRawExperiments: (experiments: JSONBinExperiment[]) => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getEquipmentByType: (type: string) => Equipment[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastSyncTime: (time: number) => void;
  clear: () => void;
}

// Initial state
export const initialDataStore: DataStore = {
  organizationId: null,
  snapshots: [],
  currentSnapshot: null,
  equipment: [],
  rawExperiments: [],
  historicalData: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  lastSyncTime: null,
  isLoading: false,
  error: null,
};

// Store implementation (reducer-like pattern)
export class InternalDatabase {
  private state: DataStore;
  private listeners: Set<(state: DataStore) => void> = new Set();

  constructor() {
    this.state = { ...initialDataStore };
  }

  // Getters
  getState(): DataStore {
    return { ...this.state };
  }

  getEquipment(): Equipment[] {
    return [...this.state.equipment];
  }

  getRawExperiments(): JSONBinExperiment[] {
    return [...this.state.rawExperiments];
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.state.equipment.find((eq) => eq.id === id);
  }

  getEquipmentByType(type: string): Equipment[] {
    return this.state.equipment.filter((eq) => eq.type === type);
  }

  // Setters
  setOrganizationId(organizationId: string | null): void {
    // Clear data when organization changes
    if (this.state.organizationId !== organizationId) {
      this.state = {
        ...initialDataStore,
        organizationId,
      };
      this.notify();
    }
  }

  getOrganizationId(): string | null {
    return this.state.organizationId;
  }

  setEquipment(equipment: Equipment[]): void {
    this.state = {
      ...this.state,
      equipment: [...equipment],
    };
    this.notify();
  }

  setRawExperiments(experiments: JSONBinExperiment[]): void {
    this.state = {
      ...this.state,
      rawExperiments: [...experiments],
    };
    this.notify();
  }

  setLoading(loading: boolean): void {
    this.state = {
      ...this.state,
      isLoading: loading,
    };
    this.notify();
  }

  setError(error: string | null): void {
    this.state = {
      ...this.state,
      error,
    };
    this.notify();
  }

  setLastSyncTime(time: number): void {
    this.state = {
      ...this.state,
      lastSyncTime: time,
    };
    this.notify();
  }

  // Mutations
  addEquipment(equipment: Equipment): void {
    // Prevent duplicates
    if (!this.state.equipment.find((eq) => eq.id === equipment.id)) {
      this.state = {
        ...this.state,
        equipment: [...this.state.equipment, equipment],
      };
      this.notify();
    }
  }

  updateEquipment(id: string, updates: Partial<Equipment>): void {
    const index = this.state.equipment.findIndex((eq) => eq.id === id);
    if (index !== -1) {
      const updated = [...this.state.equipment];
      updated[index] = { ...updated[index], ...updates };
      this.state = {
        ...this.state,
        equipment: updated,
      };
      this.notify();
    }
  }

  removeEquipment(id: string): void {
    this.state = {
      ...this.state,
      equipment: this.state.equipment.filter((eq) => eq.id !== id),
    };
    this.notify();
  }

  setHistoricalData(historicalData: DataStore['historicalData']): void {
    this.state = {
      ...this.state,
      historicalData,
    };
    this.notify();
  }

  getHistoricalData(): DataStore['historicalData'] {
    return { ...this.state.historicalData };
  }

  setSnapshots(snapshots: TimestampedEquipmentSnapshot[]): void {
    this.state = {
      ...this.state,
      snapshots: [...snapshots],
      currentSnapshot: snapshots.length > 0 ? snapshots[snapshots.length - 1] : null,
      equipment: snapshots.length > 0 ? snapshots[snapshots.length - 1].equipment : [],
    };
    this.notify();
  }

  getSnapshots(): TimestampedEquipmentSnapshot[] {
    return [...this.state.snapshots];
  }

  getCurrentSnapshot(): TimestampedEquipmentSnapshot | null {
    return this.state.currentSnapshot ? { ...this.state.currentSnapshot } : null;
  }

  // Clear all data
  clear(): void {
    this.state = { ...initialDataStore };
    this.notify();
  }

  // Observer pattern for React hooks
  subscribe(listener: (state: DataStore) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener(this.getState());
    });
  }
}

// Singleton instance
export const database = new InternalDatabase();
