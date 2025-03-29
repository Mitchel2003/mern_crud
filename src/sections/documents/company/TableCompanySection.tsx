import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { ThemeContextProps, User } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/props.interface"
import { useQueryUser } from "@/hooks/query/useAuthQuery"

import ItemDropdown from "#/ui/data-table/item-dropdown"
import AlertDialog from "#/common/elements/AlertDialog"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { useAuthContext } from "@/context/AuthContext"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash } from "lucide-react"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"

interface TableCompanySectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface CompanyActionsProps { company: User; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar las clientes
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las clientes, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCompanySection = ({ theme, onChange }: TableCompanySectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: companies } = useQueryUser().fetchUserByQuery<User>({ role: 'company' })
  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={companies || []}
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

export default TableCompanySection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
* Hook para crear las columnas de la tabla de clientes
* @param onChange - La función que se ejecutará cuando se seleccione una acción
* @returns Array de columnas para la tabla de clientes
*/
const columns = (onChange: (value: string) => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nombre del cliente",
    cell: ({ row }) => row.original.username
  },
  {
    accessorKey: "nit",
    header: "NIT"
  },
  {
    accessorKey: "invima",
    header: "Invima"
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => formatDate(row.original?.updatedAt)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useCompanyActions({ company: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de clientes
 * @param client - El cliente sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el cliente
 */
const useCompanyActions = ({ company, onChange }: CompanyActionsProps): ActionProps[] => {
  const { delete: _delete } = useAuthContext()
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  return [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Proveedor de servicios',
        description: `¿Deseas editar el proveedor de servicios "${company?.username}"?`,
        action: () => { onChange('form'); navigate(`/company/${company?._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Proveedor de servicios',
        description: `¿Estás seguro que deseas eliminar el proveedor de servicios "${company?.username}"?`,
        action: () => _delete('password from frontend (dialog form)')
      })
    }
  }]
}