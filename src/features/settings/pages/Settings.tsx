import { Database, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/shared'

type Theme = 'light' | 'dark' | 'system'

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={18} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={18} /> },
    { value: 'system', label: 'System', icon: <Monitor size={18} /> },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage your application preferences</p>
      </div>

      {/* Appearance Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Theme</h3>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                    ${theme === option.value
                      ? 'bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-500 dark:border-emerald-600'
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                    }
                  `}
                >
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {theme === 'system'
                ? 'Theme will automatically match your system preferences'
                : `Using ${theme} mode`}
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Source</h2>
        <div className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Database size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Using Mock Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This application is currently running with simulated equipment data for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
