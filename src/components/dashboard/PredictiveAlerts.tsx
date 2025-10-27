import { Alert } from '../../types'
import { Wrench, Lightbulb, ChevronRight } from 'lucide-react'

interface PredictiveAlertsProps {
  alerts: Alert[];
}

export default function PredictiveAlerts({ alerts }: PredictiveAlertsProps) {
  const getAlertIcon = (type: Alert['type']) => {
    return type === 'maintenance' ? Wrench : Lightbulb
  }

  const getAlertIconBg = (type: Alert['type']) => {
    return type === 'maintenance' ? 'bg-orange-500/10' : 'bg-green-500/10'
  }

  const getAlertIconColor = (type: Alert['type']) => {
    return type === 'maintenance' ? 'text-orange-500' : 'text-green-500'
  }

  const getActionButtonStyle = (type: Alert['type']) => {
    return type === 'maintenance'
      ? 'bg-orange-500 hover:bg-orange-600 text-white'
      : 'bg-green-500 hover:bg-green-600 text-white'
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Predictive Alerts</h2>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No alerts at this time
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type)

            return (
              <div
                key={alert.id}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getAlertIconBg(alert.type)}`}>
                    <Icon size={20} className={getAlertIconColor(alert.type)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {alert.equipment} {alert.equipmentId}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {alert.description}
                    </p>
                    {alert.potentialSavings && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-3">
                        Potential savings: {alert.potentialSavings}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getActionButtonStyle(alert.type)}`}
                    >
                      {alert.actionLabel}
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
