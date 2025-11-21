import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { EquipmentEmission } from '../../types'
import { ChevronRight } from 'lucide-react'

interface TopEquipmentChartProps {
  data: EquipmentEmission[];
}

export default function TopEquipmentChart({ data }: TopEquipmentChartProps) {
  const isDark = document.documentElement.classList.contains('dark')

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Equipment by Emissions</h2>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <XAxis
            type="number"
            stroke={isDark ? "#6B7280" : "#9CA3AF"}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={isDark ? "#6B7280" : "#9CA3AF"}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDark ? '#F9FAFB' : '#111827'
            }}
            formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']}
            cursor={{ fill: isDark ? '#374151' : '#F3F4F6' }}
          />
          <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
