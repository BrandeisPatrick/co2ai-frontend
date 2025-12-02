import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MonthlyEmissionPoint } from '@/types'

interface MonthlyEmissionsTrendProps {
  data: MonthlyEmissionPoint[];
}

export default function MonthlyEmissionsTrend({ data }: MonthlyEmissionsTrendProps) {
  return (
    <div className="glass-card rounded-xl p-3 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Monthly Emissions Trend</h2>
      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#111827'
            }}
            formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']}
            labelFormatter={(label) => `${label}`}
            labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
