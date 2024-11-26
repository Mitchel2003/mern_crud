import { useQueryReact, useCustomMutation } from "@/hooks/useCountry"
import { ActionProps } from "@/interfaces/hook.interface"
import { Country } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Pencil, Trash } from "lucide-react"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

const CountryList = () => {
  const { theme } = useThemeContext()
  const { fetchCountries } = useQueryReact()
  const { data: countries, isLoading } = fetchCountries()

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
      cell: ({ row }) => <ItemDropdown actions={useCountryActions(row.original)} />
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
  const { deleteCountry } = useCustomMutation()
  const deleteMutation = deleteCountry()
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
      onClick: () => deleteMutation.mutate(country?._id as string),
      className: "text-red-600"
    }
  ]
}

