import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { City, ThemeContextProps } from "@/interfaces/context.interface"
import { useActionConfirmContext } from "@/context/ActionConfirmContext"
import { ActionProps } from "@/interfaces/props.interface"

import ItemDropdown from "#/ui/data-table/item-dropdown"
import AlertDialog from "#/common/elements/AlertDialog"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/constants"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableCitySectionProps extends ThemeContextProps { onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las ciudades
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las ciudades, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCitySection = ({ theme, onChange }: TableCitySectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useActionConfirmContext()
  const { data: cities } = useQueryLocation().fetchAllLocations<City>('city')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={cities || []}
            columns={columns(onChange)}
          />
        </Card>
      </div>

      <AlertDialog
        open={show}
        theme={theme}
        title={title}
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onOpenChange={setShow}
        description={description}
        onConfirm={handleConfirm}
        variant={isDestructive ? "destructive" : "default"}
      />
    </>
  )
}

export default TableCitySection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
* Hook para crear las columnas de la tabla de ciudades
* @param onChange - La función que se ejecutará cuando se seleccione una acción
* @returns Array de columnas para la tabla de ciudades
*/
const columns = (onChange: (value: string) => void): ColumnDef<City>[] => [
  {
    accessorKey: "name",
    header: "Nombre de la ciudad"
  },
  {
    accessorKey: "state",
    header: "Departamento",
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

interface CityActionsProps { city: City; onChange: (value: string) => void }
/**
 * Hook personalizado para manejar las acciones del dropdown de ciudades
 * @param city - La ciudad sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para la ciudad
 */
const useCityActions = ({ city, onChange }: CityActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('city')
  const { confirmAction } = useActionConfirmContext()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Ciudad',
        isDestructive: false,
        description: `¿Deseas editar la ciudad "${city.name}"?`,
        action: () => { onChange('form'); navigate(`/location/city/${city._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Ciudad',
        description: `¿Estás seguro que deseas eliminar la ciudad "${city.name}"?`,
        action: () => deleteLocation({ id: city._id })
      })
    }
  }]
}