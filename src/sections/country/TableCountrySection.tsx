import { useQueryLocation, useLocationMutation } from "@/hooks/useLocationQuery"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/props.interface"
import { Country } from "@/interfaces/context.interface"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableCountrySectionProps extends ThemeContextProps { onChange: (value: string) => void }

const TableCountrySection = ({ theme, onChange }: TableCountrySectionProps) => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: countries } = fetchAllLocations<Country>('country')

  const columns: ColumnDef<Country>[] = [
    {
      accessorKey: "name",
      header: "Nombre del país"
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de creación",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString()
    },
    {
      id: "actions",
      cell: ({ row }) => <ItemDropdown actions={useCountryActions({ country: row.original, onChange })} />
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <Card className={cn(
        "p-4 border-rounded-md shadow-md",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <DataTable
          data={countries || []}
          columns={columns}
          filterColumn="name"
        />
      </Card>
    </div>
  )
}

export default TableCountrySection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
interface UseCountryActionsProps {
  country: Country
  onChange: (value: string) => void
}

const useCountryActions = ({ country, onChange }: UseCountryActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('country')
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => {
        onChange('form')
        navigate(`/location/country/${country?._id}`)
      }
    },
    {
      icon: Trash,
      label: "Eliminar",
      className: "text-red-600",
      onClick: () => deleteLocation({ id: country?._id })
    }
  ]
}