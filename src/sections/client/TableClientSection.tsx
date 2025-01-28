import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Client, ThemeContextProps } from "@/interfaces/context.interface"
import { useQueryUser, useUserMutation } from "@/hooks/query/useUserQuery"
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

interface TableClientSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface ClientActionsProps { client: Client; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las ciudades
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las ciudades, posee una configuracion de columnas y un dropdown de acciones
 */
const TableClientSection = ({ theme, onChange }: TableClientSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: clients } = useQueryUser().fetchAllUsers<Client>('client')

  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={clients || []}
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

export default TableClientSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
* Hook para crear las columnas de la tabla de clientes
* @param onChange - La función que se ejecutará cuando se seleccione una acción
* @returns Array de columnas para la tabla de clientes
*/
const columns = (onChange: (value: string) => void): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: "Nombre del cliente"
  },
  {
    accessorKey: "email",
    header: "Correo electrónico"
  },
  {
    header: "Teléfono",
    accessorKey: "phone"
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useClientActions({ client: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de clientes
 * @param client - El cliente sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el cliente
 */
const useClientActions = ({ client, onChange }: ClientActionsProps): ActionProps[] => {
  const { deleteUser } = useUserMutation('client')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Cliente',
        description: `¿Deseas editar el cliente "${client.name}"?`,
        action: () => { onChange('form'); navigate(`/client/${client._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Cliente',
        description: `¿Estás seguro que deseas eliminar el cliente "${client.name}"?`,
        action: () => deleteUser({ id: client._id })
      })
    }
  }]
}