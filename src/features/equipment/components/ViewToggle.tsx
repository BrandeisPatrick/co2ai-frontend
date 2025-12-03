import React from 'react'
import { Grid3x3, List } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
          currentView === 'grid'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Grid view"
      >
        <Grid3x3 size={18} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
          currentView === 'list'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="List view"
      >
        <List size={18} />
      </button>
    </div>
  )
}
