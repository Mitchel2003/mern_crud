import { useQueryLocation, useLocationMutation } from "@/hooks/useLocationQuery"
import { City, ThemeContextProps } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/props.interface"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/constants"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableCitySectionProps extends ThemeContextProps { onChange: (value: string) => void }

const TableCitySection = ({ theme, onChange }: TableCitySectionProps) => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: cities } = fetchAllLocations<City>('city')

  const columns: ColumnDef<City>[] = [
    {
      accessorKey: "name",
      header: "Nombre ciudad"
    },
    {
      header: "Departamento",
      accessorKey: "state",
      cell: ({ row }) => row.original.state?.name || 'Sin departamento'
    },
    {
      accessorKey: "updatedAt",
      header: "Última actualización",
      cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
    },
    {
      id: "actions",
      cell: ({ row }) => <ItemDropdown actions={useCityActions({ city: row.original, onChange })} />
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <Card className={cn(
        "p-4 border-rounded-md shadow-md",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <DataTable
          data={cities || []}
          columns={columns}
          filterColumn="name"
        />
      </Card>
    </div>
  )
}

export default TableCitySection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
interface UseCityActionsProps {
  city: City
  onChange: (value: string) => void
}

const useCityActions = ({ city, onChange }: UseCityActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('city')
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => {
        onChange('form')
        navigate(`/location/city/${city?._id}`)
      }
    },
    {
      icon: Trash,
      label: "Eliminar",
      className: "text-red-600",
      onClick: () => deleteLocation({ id: city?._id })
    }
  ]
}