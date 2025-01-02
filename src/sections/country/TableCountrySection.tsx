import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Country, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableCountrySectionProps extends ThemeContextProps { onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los países
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los países, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCountrySection = ({ theme, onChange }: TableCountrySectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useActionConfirmContext()
  const { data } = useQueryLocation().fetchAllLocations<Country>('country')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}>
          <DataTable
            data={data || []}
            filterColumn="name"
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

export default TableCountrySection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
* Hook para crear las columnas de la tabla de países
* @param onChange - La función que se ejecutará cuando se seleccione una acción
* @returns Array de columnas para la tabla de países
*/
const columns = (onChange: (value: string) => void): ColumnDef<Country>[] => [
  {
    accessorKey: "name",
    header: "Nombre del país"
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useCountryActions({ country: row.original, onChange })} />
  }
]

interface UseCountryActionsProps { country: Country; onChange: (value: string) => void }
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
const useCountryActions = ({ country, onChange }: UseCountryActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('country')
  const { confirmAction } = useActionConfirmContext()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar País',
        isDestructive: false,
        description: `¿Deseas editar el país "${country.name}"?`,
        action: () => { onChange('form'); navigate(`/location/country/${country._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar País',
        description: `¿Estás seguro que deseas eliminar el país "${country.name}"?`,
        action: () => deleteLocation({ id: country._id })
      })
    }
  }]
}