import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Group, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableGroupSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface GroupActionsProps { group: Group; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los grupos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los grupos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableGroupSection = ({ theme, onChange }: TableGroupSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: groups } = useQueryLocation().fetchAllLocations<Group>('group')

  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={groups || []}
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

export default TableGroupSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de grupos
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de grupos
 */
const columns = (onChange: (value: string) => void): ColumnDef<Group>[] => [
  {
    accessorKey: "name",
    header: "Nombre del grupo"
  },
  {
    header: "Servicios",
    accessorKey: "services",
    cell: ({ row }) => row.original.services.map((e) => e).join(', ') || 'Sin servicios'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useGroupActions({ group: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de grupos
 * @param group - El grupo sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el grupo
 */
const useGroupActions = ({ group, onChange }: GroupActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('group')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Grupo',
        description: `¿Deseas editar el grupo "${group.name}"?`,
        action: () => { onChange('form'); navigate(`/location/group/${group._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Grupo',
        description: `¿Estás seguro que deseas eliminar el grupo "${group.name}"?`,
        action: () => deleteLocation({ id: group._id })
      })
    }
  }]
}