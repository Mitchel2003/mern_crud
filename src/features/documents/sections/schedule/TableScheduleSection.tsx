import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { CalendarMonth, Delete, Handshake, CoPresent } from "@mui/icons-material"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import AlertDialog from "#/common/elements/AlertDialog"
import { encodeQueryParams } from "@/lib/query"
import { BarChart2, Eye } from "lucide-react"
import { useMemo } from "react"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Schedule, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useScheduleTable } from "@/hooks/core/table/useFormatTable"
import { tableTranslations } from "@/constants/values.constants"
import { formatDateTime } from "@/constants/format.constants"
import { useIsMobile } from "@/hooks/ui/use-mobile"

interface TableScheduleSectionProps extends ThemeContextProps {
  params?: { type?: string, createdAt?: string } | null
  onChange: () => void
  credentials: User
}

/**
 * Permite construir un componente de tabla para mostrar los consultorios.
 * @param credentials - Credenciales del usuario
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los consultorios, posee una configuracion de columnas y un dropdown de acciones
 */
const TableScheduleSection = ({ theme, params, credentials }: TableScheduleSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { schedules, handleDelete, handleDownload } = useScheduleTable()
  const isClient = credentials?.role === 'client'
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
    title: `Cronogramas de mantenimiento`,
    value: schedules?.filter(s => s.type === 'mantenimiento').length || 0,
    href: `/form/schedule/${encodeQueryParams({ type: 'mantenimiento' })}`,
  }, {
    color: 'warning',
    icon: CoPresent as any,
    title: `Cronogramas de capacitación`,
    value: schedules?.filter(s => s.type === 'capacitación').length || 0,
    href: `/form/schedule/${encodeQueryParams({ type: 'capacitación' })}`,
  }, {
    color: 'primary',
    icon: Handshake as any,
    title: `Cronogramas de acta de asistencia`,
    value: schedules?.filter(s => s.type === 'acta de asistencia').length || 0,
    href: `/form/schedule/${encodeQueryParams({ type: 'acta de asistencia' })}`,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<Schedule>[] = [{
      id: "type",
      filterVariant: 'select',
      size: isMobile ? 100 : 150,
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
      header: "Clasificación",
      id: "typeClassification",
      size: isMobile ? 100 : 150,
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
    }];

    !isClient && array.push({
      id: "client",
      header: "Cliente",
      size: isMobile ? 150 : 200,
      accessorFn: (row) => row.client?.username || 'Sin cliente'
    }, {
      id: "createdAt",
      header: "Fecha creación",
      size: isMobile ? 100 : 120,
      accessorFn: (row) => formatDateTime(row.createdAt)
    });
    return array
  }, [isMobile, isClient])

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
        ...(params.type ? [{ id: 'type', value: params.type }] : []),
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
      'mrt-row-select': { size: 40, maxSize: 50, minSize: 30 },
      'mrt-row-actions': { size: 60, maxSize: 70, minSize: 50 }
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
          icon={CalendarMonth}
          title="Actas y cronogramas"
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