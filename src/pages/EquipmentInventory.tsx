import { useState, useMemo, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import EquipmentCard from '../components/equipment/EquipmentCard'
import AddEquipmentModal from '../components/equipment/AddEquipmentModal'
import { ViewToggle, ViewMode } from '../components/equipment/ViewToggle'
import { EquipmentTable } from '../components/equipment/EquipmentTable'
import { Equipment } from '../types'
import { useDataContext } from '../hooks/useDataContext'

// Grouped equipment interface for inventory view
interface GroupedEquipment extends Equipment {
  count: number;
  ids: string[];
}

export default function EquipmentInventory() {
  const { store, isLoading, error, addEquipment } = useDataContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Load view mode preference from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('equipment-view-mode') as ViewMode
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view mode preference to localStorage on change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('equipment-view-mode', mode)
  }

  // Group equipment by identical properties
  const groupEquipment = (items: Equipment[]): GroupedEquipment[] => {
    const groups = new Map<string, GroupedEquipment>()

    items.forEach((item) => {
      // Create a unique key based on equipment properties (excluding ID and equipmentId)
      const key = JSON.stringify({
        name: item.name,
        manufacturer: item.manufacturer,
        type: item.type,
        dailyEmissions: item.dailyEmissions
      })

      if (groups.has(key)) {
        // Add to existing group
        const existing = groups.get(key)!
        existing.count += 1
        existing.ids.push(item.id)
      } else {
        // Create new group
        groups.set(key, {
          ...item,
          count: 1,
          ids: [item.id]
        })
      }
    })

    return Array.from(groups.values())
  }

  // Filter equipment based on search query
  const filteredEquipment: GroupedEquipment[] = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupEquipment(store.equipment)
    }

    const query = searchQuery.toLowerCase()
    const filtered = store.equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.manufacturer.toLowerCase().includes(query) ||
        item.equipmentId.toLowerCase().includes(query)
    )
    return groupEquipment(filtered)
  }, [searchQuery, store.equipment])

  const handleAddEquipment = () => {
    setIsModalOpen(true)
  }

  const handleSubmitEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    try {
      // Create a new equipment with a unique ID
      const equipmentWithId: Equipment = {
        ...newEquipment,
        id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
      addEquipment(equipmentWithId)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding equipment:', err)
      alert('Failed to add equipment. Please try again.')
    }
  }

  if (isLoading && store.equipment.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading equipment...</p>
        </div>
      </div>
    )
  }

  if (error && store.equipment.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AddEquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEquipment}
      />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Equipment Inventory</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor your wet lab equipment</p>
          </div>
          <div className="flex gap-2">
            <ViewToggle currentView={viewMode} onViewChange={handleViewModeChange} />
            <button
              onClick={handleAddEquipment}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Equipment
            </button>
          </div>
        </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search equipment by name or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors"
        />
      </div>

      {/* Equipment Display - Grid or List View */}
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No equipment found matching your search.' : 'No equipment available.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
            />
          ))}
        </div>
      ) : (
        <EquipmentTable
          equipment={filteredEquipment}
        />
      )}
    </div>
    </>
  )
}
