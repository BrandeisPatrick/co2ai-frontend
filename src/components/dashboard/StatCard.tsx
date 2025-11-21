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
  index?: number;
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  improvement,
  index = 0
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
    <div className="glass-card-hover rounded-xl p-3 md:p-5 cursor-default">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-blue-500/20 dark:to-blue-600/20 rounded-lg border border-emerald-500/30 dark:border-blue-500/30">
            <Icon size={16} className="md:w-5 md:h-5 text-emerald-600 dark:text-blue-400" />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${getTrendColor()}`}>
            <TrendIcon size={14} className="md:w-4 md:h-4" />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide md:tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-1 md:gap-2">
          <span className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          {unit && <span className="text-xs md:text-sm font-medium text-gray-400 dark:text-gray-500">{unit}</span>}
        </div>
        {trend && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:mt-3">
            {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}
