import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Accessory, Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { ActionProps } from "@/interfaces/props.interface"

import ItemDropdown from "#/ui/data-table/item-dropdown"
import AlertDialog from "#/common/elements/AlertDialog"
import { DataTable } from "#/ui/data-table/data-table"
import { Card } from "#/ui/card"

import { Pencil, Trash, Eye } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/constants"
import { cn } from "@/lib/utils"

interface TableCurriculumSectionProps extends ThemeContextProps { onChange: (value: string) => void }
interface CurriculumActionsProps { curriculum: Curriculum; onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los formatos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCurriculumSection = ({ theme, onChange }: TableCurriculumSectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: curriculums } = useQueryFormat().fetchAllFormats<Curriculum>('cv')

  return (
    <>
      <div className="container p-0">
        <Card className={cn(
          "p-4 border-rounded-md shadow-md",
          theme === "dark" ? "bg-zinc-900/80" : "bg-white"
        )}>
          <DataTable
            filterColumn="name"
            data={curriculums || []}
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

export default TableCurriculumSection
/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook para crear las columnas de la tabla de oficinas
 * @param onChange - La función que se ejecutará cuando se seleccione una acción
 * @returns Array de columnas para la tabla de oficinas
 */
const columns = (onChange: (value: string) => void): ColumnDef<Curriculum>[] => [
  {
    accessorKey: "name",
    header: "Nombre del curriculum"
  },
  {
    header: "Servicio",
    accessorKey: "service",
    cell: ({ row }) => row.original?.service || 'Sin servicio'
  },
  {
    header: "Oficina",
    accessorKey: "office",
    cell: ({ row }) => row.original?.office?.name || 'Sin oficina'
  },
  {
    header: "Sede",
    accessorKey: "headquarter",
    cell: ({ row }) => row.original?.office?.headquarter?.address || 'Sin sede'
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => row.original?.office?.headquarter?.client?.name || 'Sin cliente'
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString('es-ES', formatDate)
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemDropdown actions={useCurriculumActions({ curriculum: row.original, onChange })} />
  }
]

/**
 * Hook personalizado para manejar las acciones del dropdown de oficinas
 * @param office - La oficina sobre la que se realizarán las acciones
 * @returns Array de acciones disponibles para la oficina
 */
const useCurriculumActions = ({ curriculum, onChange }: CurriculumActionsProps): ActionProps[] => {
  const { deleteFormat: deleteAcc } = useFormatMutation('accessory')
  const { deleteFormat: deleteCv } = useFormatMutation('cv')
  const { deleteFile: deleteImg } = useFormatMutation('file')
  const { confirmAction } = useDialogConfirm()
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    await deleteCv({ id }).then(async () => {
      const { data: existingAccessories } = useQueryFormat().fetchFormatByQuery<Accessory>('accessory', { curriculum: id })
      await Promise.all(existingAccessories?.map(async (acc) => await deleteAcc({ id: acc._id })) || [])
      await deleteImg({ id, ref: 'preview', filename: 'img' })
    })
  }

  return [{
    icon: Eye,
    label: "Ver",
    onClick: () => {
      confirmAction({
        title: 'Ver Curriculum',
        description: `¿Deseas ver el curriculum "${curriculum.name}"?`,
        action: () => { onChange('form'); navigate(`/form/curriculum/preview/${curriculum._id}`) }
      })
    }
  }, {
    icon: Pencil,
    label: "Editar",
    onClick: () => {
      confirmAction({
        title: 'Editar Curriculum',
        description: `¿Deseas editar el curriculum "${curriculum.name}"?`,
        action: () => { onChange('form'); navigate(`/form/curriculum/${curriculum._id}`) }
      })
    }
  }, {
    icon: Trash,
    label: "Eliminar",
    className: "text-red-600",
    onClick: () => {
      confirmAction({
        isDestructive: true,
        title: 'Eliminar Curriculum',
        description: `¿Estás seguro que deseas eliminar el curriculum "${curriculum.name}"?`,
        action: () => { handleDelete(curriculum._id) }
      })
    }
  }]
}