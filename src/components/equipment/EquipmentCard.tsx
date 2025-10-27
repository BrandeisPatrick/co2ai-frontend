import { Equipment } from '../../types'
import { Zap, Activity, MoreVertical } from 'lucide-react'

interface EquipmentCardProps {
  equipment: Equipment & { count?: number };
  onViewDetails?: (id: string) => void;
}

export default function EquipmentCard({ equipment, onViewDetails }: EquipmentCardProps) {
  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'idle':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'maintenance':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'offline':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {equipment.name}
              {equipment.count && equipment.count > 1 && (
                <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  {equipment.count} device{equipment.count !== 1 ? 's' : ''}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{equipment.manufacturer}</p>
          </div>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0 ml-2">
            <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md border border-gray-300 dark:border-gray-700">
            {equipment.type}
          </span>
          <span className={`px-2.5 py-1 text-xs rounded-md border ${getStatusColor(equipment.status)}`}>
            {formatStatus(equipment.status)}
          </span>
        </div>
      </div>

      {/* Equipment Image Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 h-48 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-400 dark:text-gray-600">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Activity size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-xs">Equipment Image</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Zap size={16} />
            <span className="text-sm">Power Draw</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {equipment.powerDraw.value} {equipment.powerDraw.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Activity size={16} />
            <span className="text-sm">Daily Emissions</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {equipment.dailyEmissions.value} {equipment.dailyEmissions.unit}
          </span>
        </div>
      </div>

      {/* View Details Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onViewDetails?.(equipment.id)}
          className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
