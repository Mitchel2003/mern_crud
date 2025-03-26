import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { ThemeContextProps, User } from "@/interfaces/context.interface"
import { useCurriculumTable } from "@/hooks/auth/useFormatForm"
import { ActionProps } from "@/interfaces/props.interface"
import { useQueryUser } from "@/hooks/query/useAuthQuery"

import ItemDropdown from "#/ui/data-table/item-dropdown"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import AlertDialog from "#/common/elements/AlertDialog"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash } from "lucide-react"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"

interface TableStaffSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface ActionsProps {
  onChange: (value: string) => void
  onDelete: (id: string) => void
  staff: User
}

/**
 * Permite construir un componente de tabla para mostrar los curriculums
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los curriculums, posee una configuracion de columnas y un dropdown de acciones
 */
const TableStaffSection = ({ theme, onChange }: TableStaffSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: staff, isLoading } = useQueryUser().fetchUserByQuery<User>({ role: 'engineer' })
  const { handleDelete } = useCurriculumTable()

  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={staff || []}
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

export default TableStaffSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de curriculums
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @param onDelete - La función que se ejecutará cuando se seleccione la acción de eliminar
 * @returns Array de columnas para la tabla de curriculums
 */
const useColumns = (onChange: (value: string) => void, onDelete: (id: string) => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nombre del usuario",
    cell: ({ row }) => row.original?.username || 'Sin nombre'
  },
  {
    header: "Rol",
    accessorKey: "role",
    cell: ({ row }) => row.original?.role || 'Sin rol'
  },
  {
    header: "Correo",
    accessorKey: "email",
    cell: ({ row }) => row.original?.email || 'Sin correo'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => formatDate(row.original?.updatedAt)
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions staff={row.original} onChange={onChange} onDelete={onDelete} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de usuarios
 * @param staff - El usuario sobre el que se realizarán las acciones
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @param onDelete - La función que se ejecutará cuando se seleccione la acción de eliminar
 * @returns Array de acciones disponibles para el usuario
 */
const Actions = ({ staff, onChange, onDelete }: ActionsProps) => {
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  const actions: ActionProps[] = [{
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Usuario',
        description: `¿Deseas editar el usuario "${staff?.username || 'Sin nombre'}"?`,
        action: () => { onChange('form'); navigate(`/staff/${staff?._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Usuario',
        description: `¿Estás seguro que deseas eliminar el usuario "${staff?.username || 'Sin nombre'}"?`,
        action: () => onDelete(staff?._id as string)
      })
    }
  }]
  return <ItemDropdown actions={actions} />
}