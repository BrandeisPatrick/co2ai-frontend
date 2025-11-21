import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
    label: string;
  };
  improvement?: boolean;
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  improvement
}: StatCardProps) {
  const getTrendColor = () => {
    if (!trend) return ''

    // For efficiency score, increase is good (green)
    // For emissions/consumption, decrease is good (green)
    if (improvement !== undefined) {
      return improvement ? 'text-green-500' : 'text-red-500'
    }

    return trend.type === 'decrease' ? 'text-green-500' : 'text-red-500'
  }

  const TrendIcon = trend?.type === 'increase' ? TrendingUp : TrendingDown

  return (
    <div className="glass-card-hover rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Icon size={20} className="text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            <TrendIcon size={16} />
            <span className="font-medium">{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {trend && (
          <p className="text-xs text-gray-500 mt-2">{trend.label}</p>
        )}
      </div>
    </div>
  )
}
