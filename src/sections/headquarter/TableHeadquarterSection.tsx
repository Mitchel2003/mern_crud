import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Headquarter, ThemeContextProps } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/props.interface"

import ItemDropdown from "#/ui/data-table/item-dropdown"
import AlertDialog from "#/common/elements/AlertDialog"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash } from "lucide-react"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"

interface TableHeadquarterSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface HeadquarterActionsProps { headquarter: Headquarter; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las sedes
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las sedes, posee una configuracion de columnas y un dropdown de acciones
 */
const TableHeadquarterSection = ({ theme, onChange }: TableHeadquarterSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: headquarters } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')

  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={headquarters || []}
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

export default TableHeadquarterSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de sedes
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de sedes
 */
const columns = (onChange: (value: string) => void): ColumnDef<Headquarter>[] => [
  {
    accessorKey: "name",
    header: "Nombre de la sede"
  },
  {
    header: "Dirección",
    accessorKey: "address"
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => row.original.client?.name || 'Sin cliente'
  },
  {
    header: "Ciudad",
    accessorKey: "city",
    cell: ({ row }) => row.original.city?.name || 'Sin ciudad'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => formatDate(row.original?.updatedAt)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useHeadquarterActions({ headquarter: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de sedes
 * @param headquarter - La sede sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para la sede
 */
const useHeadquarterActions = ({ headquarter, onChange }: HeadquarterActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('headquarter')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Sede',
        description: `¿Deseas editar la sede "${headquarter.name}"?`,
        action: () => { onChange('form'); navigate(`/location/headquarter/${headquarter._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Sede',
        description: `¿Estás seguro que deseas eliminar la sede "${headquarter.name}"?`,
        action: () => deleteLocation({ id: headquarter._id })
      })
    }
  }]
} 