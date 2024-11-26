import { useQueryReact, useCustomMutation } from "@/hooks/useCurriculum"
import { Curriculum } from "@/interfaces/context.interface"
import { ActionProps } from "@/interfaces/hook.interface"
import { useThemeContext } from "@/context/ThemeContext"
import ItemDropdown from "#/ui/data-table/item-dropdown"
import { DataTable } from "#/ui/data-table/data-table"
import { Pencil, Trash } from "lucide-react"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

const CurriculumList = () => {
  const { theme } = useThemeContext()
  const { fetchCVs } = useQueryReact()
  const { data: cvs, isLoading } = fetchCVs()

  const columns: ColumnDef<Curriculum>[] = [
    {
      accessorKey: "title",
      header: "Título"
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de creación",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString()
    },
    {
      id: "actions",
      cell: ({ row }) => <ItemDropdown actions={useCurriculumActions(row.original)} />
    }
  ]

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="container mx-auto py-10">
      <Card className={cn(
        "p-4 border-rounded-md shadow-md",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <DataTable
          data={cvs || []}
          columns={columns}
          filterColumn="name"
        />
      </Card>
    </div>
  )
}

export default CurriculumList

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar las acciones del dropdown de currículums
 * @param cv - El currículum sobre el que se realizarán las acciones
 * @returns Array de acciones disponibles para el currículum
 */
const useCurriculumActions = (cv: Curriculum): ActionProps[] => {
  const { deleteCV } = useCustomMutation()
  const deleteMutation = deleteCV()
  const navigate = useNavigate()

  return [
    {
      icon: Pencil,
      label: "Editar",
      onClick: () => navigate(`/form/cv/${cv?._id}`)
    },
    {
      icon: Trash,
      label: "Eliminar",
      onClick: () => deleteMutation.mutate(cv?._id || ""),
      className: "text-red-600"
    }
  ]
} 