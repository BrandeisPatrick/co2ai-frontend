import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import EquipmentCard from '../components/EquipmentCard'
import AddEquipmentModal from '../components/AddEquipmentModal'
import { ViewToggle } from '../components/ViewToggle'
import { EquipmentTable } from '../components/EquipmentTable'
import { Equipment } from '@/types'
import { useDataContext } from '@/shared/hooks/useDataContext'
import { useEquipmentSearch } from '../hooks/useEquipmentSearch'
import { SkeletonEquipmentGrid, SkeletonTable } from '@/shared/components/ui/skeleton'

export default function EquipmentInventory() {
  const { store, isLoading, error, addEquipment } = useDataContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filteredEquipment,
  } = useEquipmentSearch({ equipment: store.equipment })

  const handleAddEquipment = () => {
    setIsModalOpen(true)
  }

  const handleSubmitEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    try {
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
      <div className="p-4 md:p-6 space-y-6">
        <div className="mb-6 pt-12 md:pt-0">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
        {viewMode === 'grid' ? <SkeletonEquipmentGrid /> : <SkeletonTable rows={6} />}
      </div>
    )
  }

  if (error && store.equipment.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
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

      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 pt-12 md:pt-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Equipment Inventory</h1>
            <p className="text-sm md:text-base text-gray-600">Manage and monitor your wet lab equipment</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <button
              onClick={handleAddEquipment}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors w-full md:w-auto"
            >
              <Plus size={20} />
              Add Equipment
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search equipment by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>

        {/* Equipment Display - Grid or List View */}
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
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
