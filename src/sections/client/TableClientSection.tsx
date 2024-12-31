import { Client, ThemeContextProps } from "@/interfaces/context.interface"
import { useQueryUser, useUserMutation } from "@/hooks/useUserQuery"
import { ActionProps } from "@/interfaces/props.interface"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/constants"
import { Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableClientSectionProps extends ThemeContextProps { onChange: (value: string) => void }

const TableClientSection = ({ theme, onChange }: TableClientSectionProps) => {
  const { fetchAllUsers: fetchAllClients } = useQueryUser()
  const { data: clients } = fetchAllClients<Client>('client')

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Nombre cliente"
    },
    {
      accessorKey: "email",
      header: "Correo electrónico"
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

  return (
    <div className="container mx-auto py-10">
      <Card className={cn(
        "p-4 border-rounded-md shadow-md",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <DataTable
          data={clients || []}
          columns={columns}
          filterColumn="name"
        />
      </Card>
    </div>
  )
}

export default TableClientSection

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de países
 * @param country - El país sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el país
 */
interface UseClientActionsProps {
  client: Client
  onChange: (value: string) => void
}

const useClientActions = ({ client, onChange }: UseClientActionsProps): ActionProps[] => {
  const { deleteUser: deleteClient } = useUserMutation('client')
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => {
        onChange('form')
        navigate(`/client/${client?._id}`)
      }
    },
    {
      icon: Trash,
      label: "Eliminar",
      className: "text-red-600",
      onClick: () => deleteClient({ id: client?._id })
    }
  ]
}