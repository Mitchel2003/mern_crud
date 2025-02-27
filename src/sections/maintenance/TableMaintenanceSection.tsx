import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Maintenance, ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceTable } from "@/hooks/auth/useFormatForm"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
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

interface TableMaintenanceSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface ActionsProps {
  onChange: (value: string) => void
  onDelete: (id: string) => void
  maintenance: Maintenance
}

/**
 * Permite construir un componente de tabla para mostrar los mantenimientos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: maintenances } = useQueryFormat().fetchAllFormats<Maintenance>('maintenance')
  const { handleDelete } = useMaintenanceTable()

  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={maintenances || []}
            columns={useColumns(onChange, handleDelete)}
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

export default TableMaintenanceSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de oficinas
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @param onDelete - La función que se ejecutará cuando se seleccione la acción de eliminar
 * @returns Array de columnas para la tabla de oficinas
 */
const useColumns = (onChange: (value: string) => void, onDelete: (id: string) => void): ColumnDef<Maintenance>[] => [
  {
    accessorKey: "name",
    header: "Nombre equipo",
    cell: ({ row }) => row.original?.curriculum?.name || 'Sin equipo'
  },
  {
    header: "Estado del equipo",
    accessorKey: "statusEquipment",
    cell: ({ row }) => row.original?.statusEquipment === 'bueno' ? 'bueno ✅' : (
      row.original?.statusEquipment === 'pendiente' ? 'pendiente⚠️' : 'inactivo❌'
    )
  },
  {
    accessorKey: "dateNextMaintenance",
    header: "Fecha del próximo mantenimiento",
    cell: ({ row }) => row.original?.dateNextMaintenance ? new Date(row.original?.dateNextMaintenance).toLocaleString('es-ES', formatDate) : 'Sin fecha'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions maintenance={row.original} onChange={onChange} onDelete={onDelete} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de mantenimientos
 * @param maintenance - El mantenimiento sobre el que se realizarán las acciones
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @param onDelete - La función que se ejecutará cuando se seleccione la acción de eliminar
 * @returns Array de acciones disponibles para el mantenimiento
 */
const Actions = ({ maintenance, onChange, onDelete }: ActionsProps) => {
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  const actions: ActionProps[] = [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Mantenimiento',
        description: `¿Deseas editar el mantenimiento de "${maintenance.curriculum?.name}"?`,
        action: () => { onChange('form'); navigate(`/form/maintenance/${maintenance._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Mantenimiento',
        description: `¿Estás seguro que deseas eliminar el mantenimiento de "${maintenance.curriculum?.name}"?`,
        action: () => onDelete(maintenance._id)
      })
    }
  }]
  return <ItemDropdown actions={actions} />
}