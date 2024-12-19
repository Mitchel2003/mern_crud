import { ActionProps } from "@/interfaces/props.interface"
import { Country } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { useQueryLocation, useLocationMutation } from "@/hooks/useLocation"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"


const CountryList = () => {
  const { theme } = useThemeContext()
  const { fetchAllLocations } = useQueryLocation()
  const { data: countries, isLoading } = fetchAllLocations<Country>('country')

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
      cell: ({ row }) => <ItemDropdown actions={useCountryActions(row.original as Country)} />
    }
  ]

  if (isLoading) return <div>Cargando...</div>

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

export default CountryList

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
const useCountryActions = (country: Country): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('country')
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => navigate(`/location/country/${country?._id}`)
    },
    {
      icon: Trash,
      label: "Eliminar",
      className: "text-red-600",
      onClick: () => deleteLocation(country?._id as string)
    }
  ]
}

