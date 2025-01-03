import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Area, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableAreaSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface AreaActionsProps { area: Area; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las áreas
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las áreas, posee una configuracion de columnas y un dropdown de acciones
 */
const TableAreaSection = ({ theme, onChange }: TableAreaSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: areas } = useQueryLocation().fetchAllLocations<Area>('area')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={areas || []}
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

export default TableAreaSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de áreas
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de áreas
 */
const columns = (onChange: (value: string) => void): ColumnDef<Area>[] => [
  {
    accessorKey: "name",
    header: "Nombre del área"
  },
  {
    header: "Sede",
    accessorKey: "headquarter",
    cell: ({ row }) => row.original.headquarter?.name || 'Sin sede'
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => row.original.headquarter?.client?.name || 'Sin cliente'
  },
  {
    header: "Ciudad",
    accessorKey: "city",
    cell: ({ row }) => row.original.headquarter?.city?.name || 'Sin ciudad'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useAreaActions({ area: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de áreas
 * @param area - El área sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para el área
 */
const useAreaActions = ({ area, onChange }: AreaActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('area')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Área',
        isDestructive: false,
        description: `¿Deseas editar el área "${area.name}"?`,
        action: () => { onChange('form'); navigate(`/location/area/${area._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Área',
        description: `¿Estás seguro que deseas eliminar el área "${area.name}"?`,
        action: () => deleteLocation({ id: area._id })
      })
    }
  }]
} 