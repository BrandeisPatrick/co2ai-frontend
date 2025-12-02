import { useState, useMemo } from 'react'
import { X, Search, Zap, Leaf } from 'lucide-react'
import { Equipment } from '@/types'
import { equipmentCatalog, EquipmentCatalogItem } from '@/services/data/equipmentCatalog'

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
}

export default function AddEquipmentModal({ isOpen, onClose, onSubmit }: AddEquipmentModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentCatalogItem | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState('')

  // Filter equipment based on search query
  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return equipmentCatalog
    const query = searchQuery.toLowerCase()
    return equipmentCatalog.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.equipmentType.toLowerCase().includes(query) ||
      item.manufacturer.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleSelectEquipment = (item: EquipmentCatalogItem) => {
    setSelectedEquipment(item)
    setSearchQuery(item.name)
    setIsDropdownOpen(false)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEquipment) {
      setError('Please select equipment from the catalog')
      return
    }

    // Calculate daily emissions from annual carbon impact
    const dailyEmissions = selectedEquipment.annualCarbonImpact / 365

    const equipment: Omit<Equipment, 'id'> = {
      name: selectedEquipment.name,
      equipmentId: '',
      manufacturer: selectedEquipment.manufacturer,
      type: selectedEquipment.equipmentType as Equipment['type'],
      dailyEmissions: {
        value: Math.round(dailyEmissions * 100) / 100,
        unit: 'kgCO₂e'
      },
      image: selectedEquipment.image ? `/equipment-info/${selectedEquipment.image}` : undefined
    }

    onSubmit(equipment)
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setSelectedEquipment(null)
    setIsDropdownOpen(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="glass-overlay absolute inset-0"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="glass-modal relative rounded-xl shadow-2xl w-full max-w-3xl min-h-[500px] max-h-[95vh] overflow-y-auto overflow-x-hidden m-4 border border-white/20">
        {/* Header */}
        <div className="sticky top-0 glass-modal border-b border-white/20 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Add New Equipment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Equipment Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Select Equipment
            </h3>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                    if (selectedEquipment && e.target.value !== selectedEquipment.name) {
                      setSelectedEquipment(null)
                    }
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className={`w-full pl-10 pr-4 py-3 bg-white border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors`}
                  placeholder="Search equipment by name, type, or manufacturer..."
                />
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectEquipment(item)}
                        className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        {item.image && (
                          <img
                            src={`/equipment-info/${item.image}`}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded bg-gray-50"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.manufacturer} · {item.equipmentType}</p>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium whitespace-nowrap">
                          {item.carbonFootprint.toLocaleString()} kgCO₂e
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No equipment found
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
              )}
            </div>
          </div>

          {/* Selected Equipment Preview */}
          {selectedEquipment && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
              <div className="flex gap-5">
                {/* Equipment Image */}
                {selectedEquipment.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={`/equipment-info/${selectedEquipment.image}`}
                      alt={selectedEquipment.name}
                      className="w-24 h-24 object-contain rounded-lg bg-white p-2 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Equipment Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{selectedEquipment.name}</h4>
                    <p className="text-sm text-gray-600">{selectedEquipment.manufacturer}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {selectedEquipment.equipmentType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {selectedEquipment.category}
                    </span>
                    {selectedEquipment.hasApi && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        API: {selectedEquipment.apiVendor}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Emissions Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Carbon Footprint</p>
                    <p className="font-semibold text-gray-900">{selectedEquipment.carbonFootprint.toLocaleString()} kgCO₂e</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Energy Usage</p>
                    <p className="font-semibold text-gray-900">{selectedEquipment.energyConsumption.toLocaleString()} kWh/yr</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedEquipment}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
