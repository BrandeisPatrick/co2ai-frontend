import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Database } from 'lucide-react'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage your application preferences</p>
      </div>

      {/* Appearance Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Customize how the application looks on your device
        </p>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {theme === 'dark' ? (
                <Moon size={24} className="text-blue-500" />
              ) : (
                <Sun size={24} className="text-orange-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently using {theme === 'dark' ? 'Dark' : 'Light'} mode
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleTheme()
            }}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-emerald-500'
            }`}
            aria-label="Toggle theme"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Theme Preview Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-2 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-emerald-500 dark:border-blue-500 bg-emerald-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="bg-white rounded p-2 mb-1.5 shadow-sm">
              <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-1.5 bg-gray-100 rounded w-1/2"></div>
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white text-center">Light</p>
          </button>

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-2 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-emerald-500 dark:border-blue-500 bg-emerald-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="bg-gray-800 rounded p-2 mb-1.5 shadow-sm">
              <div className="h-1.5 bg-gray-700 rounded w-3/4 mb-1"></div>
              <div className="h-1.5 bg-gray-600 rounded w-1/2"></div>
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white text-center">Dark</p>
          </button>
        </div>
      </div>

      {/* Data Source Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Source</h2>
        <div className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Database size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Using Mock Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This application is currently running with simulated equipment data for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
