import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Office, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableOfficeSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface OfficeActionsProps { office: Office; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las oficinas
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las oficinas, posee una configuracion de columnas y un dropdown de acciones
 */
const TableOfficeSection = ({ theme, onChange }: TableOfficeSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: offices } = useQueryLocation().fetchAllLocations<Office>('office')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={offices || []}
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

export default TableOfficeSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de oficinas
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de oficinas
 */
const columns = (onChange: (value: string) => void): ColumnDef<Office>[] => [
  {
    accessorKey: "name",
    header: "Nombre del consultorio"
  },
  {
    header: "Servicios",
    accessorKey: "services",
    cell: ({ row }) => row.original.services.map((e) => e).join(', ') || 'Sin servicios'
  },
  {
    header: "Área",
    accessorKey: "area",
    cell: ({ row }) => row.original.area?.name || 'Sin área'
  },
  {
    header: "Sede",
    accessorKey: "headquarter",
    cell: ({ row }) => row.original.area?.headquarter?.address || 'Sin sede'
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => row.original.area?.headquarter?.client?.name || 'Sin cliente'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useOfficeActions({ office: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de oficinas
 * @param office - La oficina sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para la oficina
 */
const useOfficeActions = ({ office, onChange }: OfficeActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('office')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Consultorio',
        isDestructive: false,
        description: `¿Deseas editar el consultorio "${office.name}"?`,
        action: () => { onChange('form'); navigate(`/location/office/${office._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Consultorio',
        description: `¿Estás seguro que deseas eliminar el consultorio "${office.name}"?`,
        action: () => deleteLocation({ id: office._id })
      })
    }
  }]
} 