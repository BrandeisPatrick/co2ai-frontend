import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { EquipmentEmission } from '@/types'
import { ChevronRight } from 'lucide-react'

interface TopEquipmentChartProps {
  data: EquipmentEmission[];
}

export default function TopEquipmentChart({ data }: TopEquipmentChartProps) {
  return (
    <div className="glass-card rounded-xl p-3 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">Top Equipment by Emissions</h2>
        <button className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={18} className="md:w-5 md:h-5 text-gray-600" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 260 : 300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: window.innerWidth < 768 ? 10 : 10, bottom: 5 }}
        >
          <XAxis
            type="number"
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: window.innerWidth < 768 ? 11 : 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: window.innerWidth < 768 ? 11 : 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            width={window.innerWidth < 768 ? 110 : 110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#111827'
            }}
            formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']}
            cursor={{ fill: '#F3F4F6' }}
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
