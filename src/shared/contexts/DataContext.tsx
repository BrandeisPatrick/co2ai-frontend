import React, { createContext, useEffect, useState, useCallback } from 'react';
import { database, DataStore } from '@/services/data/dataStore';
import { apiService } from '@/services/api';
import {
  getDailyAggregates,
  getWeeklyAggregates,
  getMonthlyAggregates
} from '@/services/data/timestampedDataSource';
import { Equipment } from '@/types';
import { useAuth } from '@/features/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface DataContextType {
  store: DataStore;
  isLoading: boolean;
  error: string | null;
  syncData: () => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  getEquipmentByType: (type: string) => Equipment[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<Equipment | null>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  removeEquipment: (id: string) => Promise<void>;
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
  const { organization, isLoading: authLoading, isConfigured, isDemoMode } = useAuth();

  // Subscribe to database changes
  useEffect(() => {
    const unsubscribe = database.subscribe((newState) => {
      setStore(newState);
    });

    return unsubscribe;
  }, []);

  // Update organization ID in database when it changes
  useEffect(() => {
    const orgId = organization?.id || null;
    database.setOrganizationId(orgId);
  }, [organization?.id]);

  // Sync data from API
  const syncData = useCallback(async () => {
    // Don't sync while auth is loading
    if (authLoading) return;

    try {
      database.setLoading(true);
      database.setError(null);

      const orgId = organization?.id;

      // If in demo mode or Supabase not configured, use mock data
      if (isDemoMode || !isSupabaseConfigured || !isConfigured) {
        // Use mock data (timestamped snapshots)
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
      } else if (orgId) {
        // Fetch from Supabase
        const [equipment, historicalData] = await Promise.all([
          apiService.getEquipment(orgId),
          apiService.getHistoricalData(orgId),
        ]);

        database.setEquipment(equipment);

        if (historicalData) {
          database.setHistoricalData(historicalData);
        }

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
  }, [organization?.id, authLoading, isConfigured, isDemoMode]);

  // Initial sync on mount and when organization changes
  useEffect(() => {
    if (!authLoading) {
      syncData();
    }
  }, [syncData, authLoading]);

  // Auto-sync interval
  useEffect(() => {
    if (!autoSync || authLoading) return;

    const intervalId = setInterval(() => {
      syncData();
    }, syncInterval);

    return () => clearInterval(intervalId);
  }, [autoSync, syncInterval, syncData, authLoading]);

  // Add equipment (async for Supabase)
  const addEquipment = useCallback(async (equipment: Omit<Equipment, 'id'>): Promise<Equipment | null> => {
    try {
      const orgId = organization?.id;
      const newEquipment = await apiService.addEquipment(equipment, orgId);
      database.addEquipment(newEquipment);
      return newEquipment;
    } catch (err) {
      console.error('Failed to add equipment:', err);
      database.setError(err instanceof Error ? err.message : 'Failed to add equipment');
      return null;
    }
  }, [organization?.id]);

  // Update equipment (async for Supabase)
  const updateEquipment = useCallback(async (id: string, updates: Partial<Equipment>): Promise<void> => {
    try {
      await apiService.updateEquipment(id, updates);
      database.updateEquipment(id, updates);
    } catch (err) {
      console.error('Failed to update equipment:', err);
      database.setError(err instanceof Error ? err.message : 'Failed to update equipment');
    }
  }, []);

  // Remove equipment (async for Supabase)
  const removeEquipment = useCallback(async (id: string): Promise<void> => {
    try {
      await apiService.deleteEquipment(id);
      database.removeEquipment(id);
    } catch (err) {
      console.error('Failed to remove equipment:', err);
      database.setError(err instanceof Error ? err.message : 'Failed to remove equipment');
    }
  }, []);

  const value: DataContextType = {
    store,
    isLoading: store.isLoading,
    error: store.error,
    syncData,
    getEquipmentById: (id: string) => database.getEquipmentById(id),
    getEquipmentByType: (type: string) => database.getEquipmentByType(type),
    addEquipment,
    updateEquipment,
    removeEquipment,
    clearData: () => database.clear(),
    lastSyncTime: store.lastSyncTime,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
