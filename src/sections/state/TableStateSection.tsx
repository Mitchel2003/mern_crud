import { useQueryLocation, useLocationMutation } from "@/hooks/query/useLocationQuery"
import { State, ThemeContextProps } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/props.interface"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/constants"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableStateSectionProps extends ThemeContextProps { onChange: (value: string) => void }

const TableStateSection = ({ theme, onChange }: TableStateSectionProps) => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: states } = fetchAllLocations<State>('state')

  const columns: ColumnDef<State>[] = [
    {
      accessorKey: "name",
      header: "Nombre departamento"
    },
    {
      header: "País",
      accessorKey: "country",
      cell: ({ row }) => row.original.country?.name || 'Sin país'
    },
    {
      accessorKey: "updatedAt",
      header: "Última actualización",
      cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
    },
    {
      id: "actions",
      cell: ({ row }) => <ItemDropdown actions={useStateActions({ state: row.original, onChange })} />
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <Card className={cn(
        "p-4 border-rounded-md shadow-md",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <DataTable
          data={states || []}
          columns={columns}
          filterColumn="name"
        />
      </Card>
    </div>
  )
}

export default TableStateSection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
interface UseStateActionsProps {
  state: State
  onChange: (value: string) => void
}

const useStateActions = ({ state, onChange }: UseStateActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('state')
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => {
        onChange('form')
        navigate(`/location/state/${state?._id}`)
      }
    },
    {
      icon: Trash,
      label: "Eliminar",
      className: "text-red-600",
      onClick: () => deleteLocation({ id: state?._id })
    }
  ]
}