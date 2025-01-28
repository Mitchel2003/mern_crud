import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Maintenance, ThemeContextProps } from "@/interfaces/context.interface"
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
interface MaintenanceActionsProps { maintenance: Maintenance; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los formatos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: maintenances } = useQueryFormat().fetchAllFormats<Maintenance>('maintenance')

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

export default TableMaintenanceSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de oficinas
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de oficinas
 */
const columns = (onChange: (value: string) => void): ColumnDef<Maintenance>[] => [
  {
    accessorKey: "name",
    header: "Nombre del ingeniero",
    cell: ({ row }) => row.original?.nameEngineer || 'Sin ingeniero'
  },
  {
    header: "Estado del equipo",
    accessorKey: "statusEquipment",
    cell: ({ row }) => row.original?.statusEquipment || 'Sin estado'
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
    cell: ({ row }) => <ItemDropdown actions={useMaintenanceActions({ maintenance: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de oficinas
 * @param office - La oficina sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para la oficina
 */
const useMaintenanceActions = ({ maintenance, onChange }: MaintenanceActionsProps): ActionProps[] => {
  const { deleteFormat } = useFormatMutation('maintenance')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Mantenimiento',
        description: `¿Deseas editar el mantenimiento de "${maintenance.nameEngineer}"?`,
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
        description: `¿Estás seguro que deseas eliminar el mantenimiento de "${maintenance.nameEngineer}"?`,
        action: () => deleteFormat({ id: maintenance._id })
      })
    }
  }]
}