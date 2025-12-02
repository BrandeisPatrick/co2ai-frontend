import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from './CustomTooltip'
import { CHART_COLORS } from '@/constants'

interface ChartDataPoint {
  name: string
  emissions: number
}

interface EmissionsLineChartProps {
  data: ChartDataPoint[]
  title: string
  unit: string
}

export function EmissionsLineChart({ data, title, unit }: EmissionsLineChartProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="glass-card rounded-lg p-3 md:p-6 hover:shadow-2xl transition-shadow overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-0">
          {title}
        </h2>
        <span className="text-xs font-medium text-gray-500">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={isMobile ? 180 : 300} minWidth={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={CHART_COLORS.gradient.emissions.start.offset}
                stopColor={CHART_COLORS.gradient.emissions.start.color}
                stopOpacity={CHART_COLORS.gradient.emissions.start.opacity}
              />
              <stop
                offset={CHART_COLORS.gradient.emissions.end.offset}
                stopColor={CHART_COLORS.gradient.emissions.end.color}
                stopOpacity={CHART_COLORS.gradient.emissions.end.opacity}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.primary, r: 5 }}
            activeDot={{ r: 7 }}
            fillOpacity={1}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
