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

interface EquipmentTableProps {
  equipment: Equipment[]
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
