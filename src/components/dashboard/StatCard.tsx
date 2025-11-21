import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
      className="glass-card-hover rounded-xl p-5 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-blue-500/20 dark:to-blue-600/20 rounded-lg border border-emerald-500/30 dark:border-blue-500/30"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon size={20} className="text-emerald-600 dark:text-blue-400" />
          </motion.div>
        </div>
        {trend && (
          <motion.div
            className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrendIcon size={16} />
            <span>{trend.value}%</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{unit}</span>}
        </div>
        {trend && (
          <motion.p
            className="text-xs text-gray-500 dark:text-gray-400 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {trend.label}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
