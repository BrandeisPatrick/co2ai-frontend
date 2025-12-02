interface TooltipPayload {
  name: string
  value: number
  color: string
  payload: {
    name: string
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-900 font-medium">{payload[0].payload.name}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}
