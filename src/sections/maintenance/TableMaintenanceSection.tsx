import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, useMaterialReactTable } from "material-react-table"
import { BarChart2, CalendarClock, Clock, AlertTriangle, Wrench } from 'lucide-react'
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { PageHeader, Stat } from '#/common/elements/HeaderPage'
import { Update, Delete, Download } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Maintenance, ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceTable } from "@/hooks/auth/useFormatForm"

import { tableTranslations } from "@/utils/constants"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { formatDateTime } from "@/utils/format"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

interface TableMaintenanceSectionProps extends ThemeContextProps {
  params?: { name?: string; modelEquip?: string } | null
  onChange: () => void
}

/**
 * Permite construir un componente de tabla para mostrar los mantenimientos
 * @param theme - El tema contexto de la aplicación
 * @param params - Parámetros para filtrar la tabla de mantenimientos
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, params, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { maintenances, handleDelete, handleDownload, handleDownloadZip } = useMaintenanceTable()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    value: maintenances?.length || 0,
    href: '/mantenimiento/todos',
    title: 'Total Mantenimientos',
  }, {
    color: 'success',
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: '/mantenimiento/hoy',
    value: maintenances?.filter(m => new Date(m.createdAt).toISOString().split('T')[0] === today).length || 0,
  }, {
    icon: Clock,
    color: 'warning',
    title: 'En Espera de Repuestos',
    href: '/mantenimiento/espera',
    value: maintenances?.filter(m => m.statusEquipment === 'en espera de repuestos').length || 0,
  }, {
    color: 'danger',
    icon: AlertTriangle,
    title: 'Fuera de Servicio',
    href: '/mantenimiento/fuera-servicio',
    value: maintenances?.filter(m => m.statusEquipment === 'fuera de servicio').length || 0,
  }]

  /** Config table columns */
  const columns = useMemo<MRT_ColumnDef<Maintenance>[]>(() => [{
    size: 150,
    header: 'Equipo',
    id: 'curriculum.name',
    accessorFn: (row) => row.curriculum.name,
  }, {
    size: 125,
    header: "Modelo",
    id: "curriculum.modelEquip",
    accessorFn: (row) => row?.curriculum?.modelEquip || 'Sin modelo'
  }, {
    size: 200,
    header: "Cliente",
    id: "curriculum.office.headquarter.user.username",
    accessorFn: (row) => row?.curriculum?.office?.headquarter?.user?.username || 'Sin cliente'
  }, {
    size: 100,
    id: "typeMaintenance",
    header: "Tipo mantenimiento",
    accessorFn: (row) => row.typeMaintenance
  }, {
    size: 100,
    header: "Estado",
    id: "statusEquipment",
    accessorFn: (row) => row.statusEquipment
  }, {
    size: 100,
    id: "dateNextMaintenance",
    header: "Prox. mantenimiento",
    accessorFn: (row) => formatDateTime(row.dateNextMaintenance)
  }], [])

  /** Table config (MRT) */
  const table = useMaterialReactTable({
    columns,
    data: maintenances || [],
    localization: tableTranslations,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableRowActions: true,
    initialState: {
      density: 'compact',
      showGlobalFilter: true,
      showColumnFilters: !!params,
      columnPinning: { left: ['mrt-row-select', 'mrt-row-expand'], right: ['mrt-row-actions'] },
      columnFilters: params ? [
        ...(params.name ? [{ id: 'curriculum.name', value: params.name }] : []),
        ...(params.modelEquip ? [{ id: 'curriculum.modelEquip', value: params.modelEquip }] : [])
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
      sx: { m: 'auto', width: 'auto', maxWidth: isMobile ? '140vw' : 'calc(100vw - 320px)' }
    },
    renderTopToolbar: ({ table }) => (// to define toolbar top (header toolbar)
      <Box sx={{ p: '8px', gap: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
        {/** to reset rows selected */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
        {/** to toggle dense and full screen */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ row, closeMenu }) => ([// to options row (actions row)
      // download pdf
      <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Descargar mantenimiento',
          description: `¿Deseas descargar el mantenimiento "${row.original.curriculum.name}"?`,
          action: () => { handleDownload(row.original) }
        })
      }}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        Descargar pdf
      </MenuItem>,

      // edit maintenance
      <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Editar mantenimiento',
          description: `¿Deseas editar el mantenimiento "${row.original.curriculum.name}"?`,
          action: () => { onChange(); navigate(`/form/maintenance/${row.original._id}`) }
        })
      }}>
        <ListItemIcon>
          <Update />
        </ListItemIcon>
        Actualizar
      </MenuItem>,

      // delete maintenance
      <MenuItem key={2} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          isDestructive: true,
          title: 'Eliminar mantenimiento',
          description: `¿Deseas eliminar el mantenimiento "${row.original.curriculum.name}"?`,
          action: () => { handleDelete(row.original._id) }
        })
      }}>
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Eliminar
      </MenuItem>
    ]),
    renderToolbarAlertBannerContent: ({ table }) => (// alert banner of rows selected (actions on multi select)
      <Box
        sx={{
          p: '8px',
          gap: '0.5rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/** info selected rows */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} mantenimiento(s) seleccionado(s)
          </Typography>
        </Box>
        {/** actions selected rows (2 buttons) */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().flatRows
              const firstEquipment = selectedRows[0].original.curriculum.name
              const otherCount = selectedRows.length - 1
              confirmAction({
                title: 'Descargar mantenimientos',
                description: `¿Deseas descargar los mantenimientos mas recientes de:
                ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} equipos` : ''}?`,
                action: () => handleDownloadZip(selectedRows.map(row => row.original))
              })
            }}
          >
            Descargar ZIP
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            startIcon={<Delete />}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().flatRows
              const firstEquipment = selectedRows[0].original.curriculum.name
              const otherCount = selectedRows.length - 1
              confirmAction({
                isDestructive: true,
                title: 'Eliminación múltiple',
                description: `¿Deseas eliminar los mantenimientos de:
                ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} equipos` : ''}?`,
                action: () => selectedRows.forEach(row => handleDelete(row.original._id))
              })
            }}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
    )
  })

  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader
          size="lg"
          icon={Wrench}
          stats={stats}
          variant="gradient"
          title="Mantenimiento"
          badge={{ text: "Sistema Activo", variant: "success", dot: true }}
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

export default TableMaintenanceSection