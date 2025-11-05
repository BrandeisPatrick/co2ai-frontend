import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { Equipment } from '../../types'
import { Eye, Edit2, Trash2, AlertCircle } from 'lucide-react'

interface EquipmentTableProps {
  equipment: Equipment[]
  onViewDetails: (id: string) => void
  onEdit?: (equipment: Equipment) => void
  onDelete?: (id: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
    case 'idle':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
    case 'maintenance':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
    case 'offline':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
    case 'faulty':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }
}

const StatusBadge = ({ status, errorMessage }: { status: string; errorMessage?: string }) => {
  const [showError, setShowError] = useState(false)

  return (
    <div className="relative">
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {status === 'faulty' && <AlertCircle size={14} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {errorMessage && (
        <div className="relative">
          <button
            onMouseEnter={() => setShowError(true)}
            onMouseLeave={() => setShowError(false)}
            className="ml-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            title="Show error details"
          >
            <AlertCircle size={16} />
          </button>
          {showError && (
            <div className="absolute z-10 bottom-full mb-2 left-0 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-2 text-sm text-red-800 dark:text-red-300 max-w-xs whitespace-normal">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'name',
      header: 'Equipment Name',
      cell: (info) => <span className="font-medium text-gray-900 dark:text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'equipmentId',
      header: 'ID',
      cell: (info) => <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const equipment = info.row.original
        return <StatusBadge status={equipment.status} errorMessage={equipment.errorMessage} />
      },
    },
    {
      accessorKey: 'powerDraw',
      header: 'Power Draw',
      cell: (info) => {
        const powerDraw = info.getValue() as { value: number; unit: string }
        return (
          <span className="text-gray-700 dark:text-gray-300">
            {powerDraw.value} {powerDraw.unit}
          </span>
        )
      },
    },
    {
      accessorKey: 'dailyEmissions',
      header: 'Daily Emissions',
      cell: (info) => {
        const emissions = info.getValue() as { value: number; unit: string }
        return (
          <span className="text-gray-700 dark:text-gray-300">
            {emissions.value} {emissions.unit}
          </span>
        )
      },
    },
    {
      accessorKey: 'manufacturer',
      header: 'Manufacturer',
      cell: (info) => <span className="text-gray-600 dark:text-gray-400 text-sm">{info.getValue() as string}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const equipment = info.row.original
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(equipment.id)}
              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="View details"
            >
              <Eye size={16} />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(equipment)}
                className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                title="Edit equipment"
              >
                <Edit2 size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(equipment.id)}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete equipment"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: equipment,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="text-xs text-gray-400">
                      {header.column.getIsSorted() === 'asc' && ' ↑'}
                      {header.column.getIsSorted() === 'desc' && ' ↓'}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isFaulty = row.original.status === 'faulty'
            return (
              <tr
                key={row.id}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isFaulty ? 'bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {equipment.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No equipment found
        </div>
      )}
    </div>
  )
}
