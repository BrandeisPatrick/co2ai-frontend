import React, { createContext, useEffect, useState, useCallback } from 'react';
import { database, DataStore } from '../services/dataStore';
import { apiService } from '../services/api';
import {
  getDailyAggregates,
  getWeeklyAggregates,
  getMonthlyAggregates
} from '../services/timestampedDataSource';
import { Equipment } from '../types';

interface DataContextType {
  store: DataStore;
  isLoading: boolean;
  error: string | null;
  syncData: () => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  getEquipmentByType: (type: string) => Equipment[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  clearData: () => void;
  lastSyncTime: number | null;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
  children: React.ReactNode;
  autoSync?: boolean;
  syncInterval?: number; // in milliseconds
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
  autoSync = true,
  syncInterval = 5 * 60 * 1000, // 5 minutes default
}) => {
  const [store, setStore] = useState<DataStore>(database.getState());

  // Subscribe to database changes
  useEffect(() => {
    const unsubscribe = database.subscribe((newState) => {
      setStore(newState);
    });

    return unsubscribe;
  }, []);

  // Sync data from API
  const syncData = useCallback(async () => {
    try {
      database.setLoading(true);
      database.setError(null);

      // Fetch all timestamped snapshots from API
      const snapshots = await apiService.getSnapshots();

      if (snapshots && snapshots.length > 0) {
        // Store all snapshots and set current snapshot
        database.setSnapshots(snapshots);

        // Generate historical data aggregates from snapshots
        const historicalData = {
          daily: getDailyAggregates(30),
          weekly: getWeeklyAggregates(12),
          monthly: getMonthlyAggregates(12),
        };
        database.setHistoricalData(historicalData);

        database.setLastSyncTime(Date.now());
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sync data';
      database.setError(errorMessage);
      console.error('Data sync error:', err);
    } finally {
      database.setLoading(false);
    }
  }, []);

  // Initial sync on mount
  useEffect(() => {
    syncData();
  }, [syncData]);

  // Auto-sync interval
  useEffect(() => {
    if (!autoSync) return;

    const intervalId = setInterval(() => {
      syncData();
    }, syncInterval);

    return () => clearInterval(intervalId);
  }, [autoSync, syncInterval, syncData]);

  const value: DataContextType = {
    store,
    isLoading: store.isLoading,
    error: store.error,
    syncData,
    getEquipmentById: (id: string) => database.getEquipmentById(id),
    getEquipmentByType: (type: string) => database.getEquipmentByType(type),
    addEquipment: (equipment: Equipment) => database.addEquipment(equipment),
    updateEquipment: (id: string, equipment: Partial<Equipment>) =>
      database.updateEquipment(id, equipment),
    removeEquipment: (id: string) => database.removeEquipment(id),
    clearData: () => database.clear(),
    lastSyncTime: store.lastSyncTime,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
