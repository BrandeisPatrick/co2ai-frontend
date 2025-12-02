import { useState, useMemo, useEffect, useCallback } from 'react'
import { Equipment } from '@/types'
import { STORAGE_KEYS } from '@/constants'

export type ViewMode = 'grid' | 'list'

interface GroupedEquipment extends Equipment {
  count: number
  ids: string[]
}

interface UseEquipmentSearchOptions {
  equipment: Equipment[]
}

interface UseEquipmentSearchReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  filteredEquipment: GroupedEquipment[]
}

/**
 * Group equipment by identical properties (excluding ID)
 */
function groupEquipment(items: Equipment[]): GroupedEquipment[] {
  const groups = new Map<string, GroupedEquipment>()

  items.forEach((item) => {
    const key = JSON.stringify({
      name: item.name,
      manufacturer: item.manufacturer,
      type: item.type,
      dailyEmissions: item.dailyEmissions,
    })

    if (groups.has(key)) {
      const existing = groups.get(key)!
      existing.count += 1
      existing.ids.push(item.id)
    } else {
      groups.set(key, {
        ...item,
        count: 1,
        ids: [item.id],
      })
    }
  })

  return Array.from(groups.values())
}

/**
 * Hook for equipment search and view mode management
 */
export function useEquipmentSearch({
  equipment,
}: UseEquipmentSearchOptions): UseEquipmentSearchReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Load view mode preference from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view mode preference to localStorage on change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode)
  }, [])

  // Filter and group equipment based on search query
  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupEquipment(equipment)
    }

    const query = searchQuery.toLowerCase()
    const filtered = equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.manufacturer.toLowerCase().includes(query) ||
        item.equipmentId.toLowerCase().includes(query)
    )
    return groupEquipment(filtered)
  }, [searchQuery, equipment])

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode: handleViewModeChange,
    filteredEquipment,
  }
}
