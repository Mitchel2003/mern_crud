import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import { CalendarMonth, Delete } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"
import { tableTranslations } from "@/utils/constants"
import { formatDateTime } from "@/utils/format"
import { BarChart2, Eye } from "lucide-react"
import { useMemo } from "react"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Schedule, ThemeContextProps } from "@/interfaces/context.interface"
import { useScheduleTable } from "@/hooks/core/table/useFormatTable"
import { useIsMobile } from "@/hooks/ui/use-mobile"

interface TableScheduleSectionProps extends ThemeContextProps {
  params?: { status?: string, name?: string, modelEquip?: string, createdAt?: string } | null
  onChange: () => void
}

/**
 * Permite construir un componente de tabla para mostrar los consultorios.
 * @param credentials - Credenciales del usuario
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los consultorios, posee una configuracion de columnas y un dropdown de acciones
 */
const TableScheduleSection = ({ theme, params }: TableScheduleSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { schedules, handleDelete, handleDownload } = useScheduleTable()
  const isMobile = useIsMobile()

  /** Header stats */
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    href: `/form/schedule`,
    value: schedules?.length || 0,
    title: `Total de cronogramas`,
  }, {
    color: 'success',
    icon: CalendarMonth as any,
    value: schedules?.filter(s => s.type === 'mantenimiento').length || 0,
    title: `Cronogramas de mantenimiento`,
  }, {
    color: 'primary',
    icon: CalendarMonth as any,
    value: schedules?.filter(s => s.type === 'capacitación').length || 0,
    title: `Cronogramas de capacitación`,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<Schedule>[] = [{
      size: 200,
      id: "type",
      filterVariant: 'select',
      header: "Tipo de cronograma",
      accessorFn: (row) => row.type,
      filterSelectOptions: ['mantenimiento', 'capacitación', 'acta de asistencia'],
      Cell: ({ row }) => (
        <Box sx={{
          gap: '8px',
          display: 'flex',
          alignItems: 'center',
          color: row.original.type === 'mantenimiento' ? 'primary.main' : row.original.type === 'capacitación' ? 'success.main' : 'info.main'
        }}>
          {row.original.type === 'mantenimiento' ? '🔧' : row.original.type === 'capacitación' ? '📚' : '📋'}
          {row.original.type}
        </Box>
      )
    }, {
      size: 200,
      id: "client",
      header: "Cliente",
      accessorFn: (row) => row.client?.username || 'Sin cliente'
    }, {
      size: 150,
      header: "Clasificación",
      id: "typeClassification",
      accessorFn: (row) => row.typeClassification,
      Cell: ({ row }) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          color: row.original.typeClassification === 'biomédico' ? 'primary.main' : row.original.typeClassification === 'red de frio' ? 'success.main' : 'info.main'
        }}>
          {row.original.typeClassification === 'biomédico' ? '🔴' : row.original.typeClassification === 'red de frio' ? '🟢' : '⚪'}
          {row.original.typeClassification}
        </Box>
      )
    }, {
      size: 150,
      id: "createdAt",
      header: "Fecha de creación",
      accessorFn: (row) => formatDateTime(row.createdAt)
    }];
    return array
  }, [])

  /** Table config (MRT) */
  const table = useMaterialReactTable({
    columns,
    data: schedules || [],
    localization: tableTranslations,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableRowActions: true,
    initialState: {
      expanded: true,
      density: 'compact',
      showGlobalFilter: true,
      showColumnFilters: !!params,
      columnPinning: { left: ['mrt-row-select', 'mrt-row-expand'], right: ['mrt-row-actions'] },
      columnFilters: params ? [
        ...(params.status ? [{ id: 'status', value: params.status }] : []),
        ...(params.createdAt ? [{ id: 'createdAt', value: params.createdAt }] : [])
      ] : []
    },
    positionToolbarAlertBanner: 'head-overlay',
    paginationDisplayMode: 'pages',
    layoutMode: 'semantic',
    muiPaginationProps: {
      shape: 'rounded',
      color: 'secondary',
      variant: 'outlined',
      rowsPerPageOptions: [10, 20, 30],
    },
    muiTableProps: {//table inside (titles row)
      sx: { width: '100%', tableLayout: 'fixed' }
    },
    muiTableContainerProps: {//table container (inside)
      sx: { maxHeight: '100%', maxWidth: '100%', overflow: 'auto' }
    },
    muiTablePaperProps: {//table inside
      sx: { m: '0', width: '100%', maxWidth: isMobile ? '95vw' : '100%' }
    },
    displayColumnDefOptions: {//table column size (columns table default)
      'mrt-row-expand': { size: 40, maxSize: 50, minSize: 30 },
      'mrt-row-select': { size: 40, maxSize: 50, minSize: 30 }
    },
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------top toolbar--------------------------------------------------*/
    renderTopToolbar: ({ table }) => (// to define toolbar top (header toolbar)
      <Box sx={{ p: '8px', gap: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
        {(table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()) && (
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => table.resetRowSelection()}
          >
            Limpiar selección
          </Button>
        )}
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Box>
    ),
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------row action menu--------------------------------------------------*/
    renderRowActionMenuItems: ({ row, closeMenu }) => {// to define row action menu (customizable)
      return [
        // Preview schedule
        <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Ver cronograma',
            description: `¿Deseas ver el cronograma de ${row.original.type} (${row.original.typeClassification}) del cliente ${row.original.client?.username || 'Sin cliente'}?`,
            action: () => handleDownload(row.original)
          })
        }}>
          <ListItemIcon> <Eye /> </ListItemIcon>
          Ver
        </MenuItem>,

        // Delete schedule
        <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar cronograma',
            description: `¿Deseas eliminar el cronograma de ${row.original.type} (${row.original.typeClassification}) del cliente ${row.original.client?.username || 'Sin cliente'}?`,
            action: () => handleDelete(row.original)
          })
        }}>
          <ListItemIcon> <Delete /> </ListItemIcon>
          Eliminar
        </MenuItem>
      ]
    },
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------Toolbar multi select--------------------------------------------------*/
    renderToolbarAlertBannerContent: ({ table }) => (// alert toolbar of rows selected (actions on multi select)
      <Box sx={{ p: '8px', gap: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/** info selected rows */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} cronograma(s) seleccionado(s)
          </Typography>
        </Box>
      </Box>
    )
  })
  /*---------------------------------------------------------------------------------------------------------*/

  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader
          size="lg"
          stats={stats}
          variant="gradient"
          title="Cronogramas"
          icon={CalendarMonth}
          badge={!isMobile ? { text: "Sistema Activo", variant: "success", dot: true } : undefined}
        />
        <MaterialReactTable table={table} />
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

export default TableScheduleSection