import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MonthlyEmissionPoint } from '../../types'

interface MonthlyEmissionsTrendProps {
  data: MonthlyEmissionPoint[];
}

export default function MonthlyEmissionsTrend({ data }: MonthlyEmissionsTrendProps) {
  // Detect theme from document
  const isDark = document.documentElement.classList.contains('dark')

  return (
    <div className="glass-card rounded-xl p-3 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">Monthly Emissions Trend</h2>
      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={isDark ? "#6B7280" : "#9CA3AF"}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
          />
          <YAxis
            stroke={isDark ? "#6B7280" : "#9CA3AF"}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDark ? '#F9FAFB' : '#111827'
            }}
            formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']}
            labelFormatter={(label) => `${label}`}
            labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke={isDark ? "#3B82F6" : "#EF4444"}
            strokeWidth={3}
            dot={{ fill: isDark ? '#3B82F6' : '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: isDark ? '#3B82F6' : '#EF4444', stroke: isDark ? '#1F2937' : '#FFFFFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
