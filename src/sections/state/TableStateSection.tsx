import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { State, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableStateSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface StateActionsProps { state: State; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los departamentos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los departamentos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableStateSection = ({ theme, onChange }: TableStateSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: states } = useQueryLocation().fetchAllLocations<State>('state')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={states || []}
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

export default TableStateSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
* Hook para crear las columnas de la tabla de departamentos
* @param onChange - La función que se ejecutará cuando se seleccione una acción
* @returns Array de columnas para la tabla de departamentos
*/
const columns = (onChange: (value: string) => void): ColumnDef<State>[] => [
  {
    accessorKey: "name",
    header: "Nombre del departamento"
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

/**
 * Hook personalizado para manejar las acciones del dropdown de departamentos
 * @param state - El departamento sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el departamento
 */
const useStateActions = ({ state, onChange }: StateActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('state')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Departamento',
        isDestructive: false,
        description: `¿Deseas editar el departamento "${state.name}"?`,
        action: () => { onChange('form'); navigate(`/location/state/${state._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Departamento',
        description: `¿Estás seguro que deseas eliminar el departamento "${state.name}"?`,
        action: () => deleteLocation({ id: state._id })
      })
    }
  }]
}