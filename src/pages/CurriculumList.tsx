import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "#/ui/dropdown-menu"
import { useQueryReact, useCustomMutation } from "@/hooks/useCurriculum"
import { Curriculum } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"
import { DataTable } from "#/ui/data-table/data-table"
import { Button } from "#/ui/button"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CurriculumList() {
  const { theme } = useThemeContext()
  const { fetchCVs } = useQueryReact()
  const { deleteCV } = useCustomMutation()
  const { data: cvs, isLoading } = fetchCVs()
  const deleteMutation = deleteCV()
  const navigate = useNavigate()

  const columns: ColumnDef<Curriculum>[] = [
    {
      accessorKey: "title",
      header: "Título"
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de creación",
      cell: ({ row }) => { return new Date(row.getValue("createdAt")).toLocaleDateString() }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cv = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/form/cv/${cv?._id}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteMutation.mutate(cv?._id || '')}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
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
          filterColumn="title"
        />
      </Card>
    </div>
  )
} 