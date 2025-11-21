import { Equipment } from '../../types'
import { Activity, MoreVertical } from 'lucide-react'

interface EquipmentCardProps {
  equipment: Equipment & { count?: number };
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {

  return (
    <div className="glass-card-hover rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-gray-800/30">
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
            <Activity size={16} />
            <span className="text-sm">Daily Emissions</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {equipment.dailyEmissions.value} {equipment.dailyEmissions.unit}
          </span>
        </div>
      </div>
    </div>
  )
}
