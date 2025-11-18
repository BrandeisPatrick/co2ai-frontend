import { useState } from 'react'
import { X } from 'lucide-react'
import { Equipment, EquipmentType } from '../../types'

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
}

const equipmentTypes: EquipmentType[] = [
  'Ultra-Low Freezer',
  'CO2 Incubator',
  'Biosafety Cabinet',
  'Autoclave',
  'PCR Machine',
  'Centrifuge',
  'Microscope',
  'Spectrophotometer',
  'GPU',
  'CPU'
]

export default function AddEquipmentModal({ isOpen, onClose, onSubmit }: AddEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    equipmentId: '',
    manufacturer: '',
    type: '' as EquipmentType,
    dailyEmissionsValue: '',
    dailyEmissionsUnit: 'kgCO₂e'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required'
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required'
    }
    if (!formData.type) {
      newErrors.type = 'Equipment type is required'
    }
    if (!formData.dailyEmissionsValue || parseFloat(formData.dailyEmissionsValue) <= 0) {
      newErrors.dailyEmissionsValue = 'Valid daily emissions is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const equipment: Omit<Equipment, 'id'> = {
      name: formData.name.trim(),
      equipmentId: formData.equipmentId.trim(),
      manufacturer: formData.manufacturer.trim(),
      type: formData.type,
      dailyEmissions: {
        value: parseFloat(formData.dailyEmissionsValue),
        unit: formData.dailyEmissionsUnit
      }
    }

    onSubmit(equipment)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      equipmentId: '',
      manufacturer: '',
      type: '' as EquipmentType,
      dailyEmissionsValue: '',
      dailyEmissionsUnit: 'kgCO₂e'
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Equipment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors`}
                  placeholder="e.g., ULT Freezer -80°C"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment ID
                </label>
                <input
                  type="text"
                  value={formData.equipmentId}
                  onChange={(e) => handleChange('equipmentId', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors"
                  placeholder="e.g., #001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.manufacturer ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors`}
                  placeholder="e.g., Thermo Fisher Scientific"
                />
                {errors.manufacturer && (
                  <p className="mt-1 text-xs text-red-500">{errors.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors`}
                >
                  <option value="">Select type...</option>
                  {equipmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-xs text-red-500">{errors.type}</p>
                )}
              </div>
            </div>

          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Performance Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Emissions <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dailyEmissionsValue}
                    onChange={(e) => handleChange('dailyEmissionsValue', e.target.value)}
                    className={`flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.dailyEmissionsValue ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors`}
                    placeholder="0.0"
                  />
                  <select
                    value={formData.dailyEmissionsUnit}
                    onChange={(e) => handleChange('dailyEmissionsUnit', e.target.value)}
                    className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-blue-600 transition-colors"
                  >
                    <option value="kgCO₂e">kgCO₂e</option>
                    <option value="tCO₂e">tCO₂e</option>
                  </select>
                </div>
                {errors.dailyEmissionsValue && (
                  <p className="mt-1 text-xs text-red-500">{errors.dailyEmissionsValue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 dark:bg-blue-600 hover:bg-emerald-700 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
