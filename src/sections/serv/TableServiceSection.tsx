import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Service, ThemeContextProps } from "@/interfaces/context.interface"
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

interface TableServiceSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface ServiceActionsProps { service: Service; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los servicios
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los servicios, posee una configuracion de columnas y un dropdown de acciones
 */
const TableServiceSection = ({ theme, onChange }: TableServiceSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: services } = useQueryLocation().fetchAllLocations<Service>('service')

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={services || []}
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

export default TableServiceSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de servicios
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de servicios
 */
const columns = (onChange: (value: string) => void): ColumnDef<Service>[] => [
  {
    accessorKey: "name",
    header: "Nombre del servicio"
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useServiceActions({ service: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de servicios
 * @param service - El servicio sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el servicio
 */
const useServiceActions = ({ service, onChange }: ServiceActionsProps): ActionProps[] => {
  const { deleteLocation } = useLocationMutation('service')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Servicio',
        description: `¿Deseas editar el servicio "${service.name}"?`,
        action: () => { onChange('form'); navigate(`/location/service/${service._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Servicio',
        description: `¿Estás seguro que deseas eliminar el servicio "${service.name}"?`,
        action: () => deleteLocation({ id: service._id })
      })
    }
  }]
}