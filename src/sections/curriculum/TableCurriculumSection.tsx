import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { BarChart2, BookMarkedIcon, CalendarClock, Eye } from 'lucide-react'
import { PageHeader, Stat } from '#/common/elements/HeaderPage'
import { Delete, Download, Update } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Curriculum, Maintenance, ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumTable, useMaintenanceTable } from "@/hooks/auth/useFormatForm"

import { tableTranslations } from "@/utils/constants"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/format"
import { useMemo } from "react"

interface TableCurriculumSectionProps extends ThemeContextProps { onChange: () => void }
interface CurriculumChildren extends Curriculum { childRows: (Maintenance & { isPreventive: boolean })[] }

/**
 * Permite construir un componente de tabla para mostrar los curriculums
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los curriculums, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCurriculumSection = ({ theme, onChange }: TableCurriculumSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { handleDownload: handleDownloadMaintenance, handleDelete: handleDeleteMaintenance } = useMaintenanceTable()
  const { curriculums: cvs, handleDelete, handleDownload, handleDownloadZip } = useCurriculumTable()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    value: cvs?.length || 0,
    href: '/curriculum/todos',
    title: 'Total Equipos',
  }, {
    color: 'success',
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: '/curriculum/hoy',
    value: cvs?.filter(c => c?.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] === today : false).length || 0,
  }]

  /** Config table columns */
  const columns = useMemo<MRT_ColumnDef<CurriculumChildren>[]>(() => [{
    size: 150,
    id: 'name',
    header: 'Equipo',
    accessorFn: (row) => row.name,
  }, {
    size: 100,
    header: "Modelo",
    id: "modelEquip",
    accessorFn: (row) => row.modelEquip || 'Sin modelo'
  }, {
    size: 150,
    header: "Cliente",
    id: "office.headquarter.client.name",
    accessorFn: (row) => row.office?.headquarter?.client?.name || 'Sin cliente'
  }, {
    size: 150,
    header: "Sede",
    id: "office.headquarter.address",
    accessorFn: (row) => row.office?.headquarter?.address || 'Sin sede'
  }, {
    size: 90,
    header: "Riesgo",
    id: "riskClassification",
    accessorFn: (row) => row.riskClassification
  }], [])

  /** Table config (MRT) */
  const table = useMaterialReactTable({
    columns,
    data: cvs || [],
    localization: tableTranslations,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableRowActions: true,
    initialState: {
      density: 'compact',
      showGlobalFilter: true,
      columnPinning: { left: ['mrt-row-select', 'mrt-row-expand'], right: ['mrt-row-actions'] },
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
    displayColumnDefOptions: {//table column size (columns table default)
      'mrt-row-expand': { size: 40, maxSize: 50, minSize: 30 },
      'mrt-row-select': { size: 40, maxSize: 50, minSize: 30 }
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
      // preview curriculum
      <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Ver Curriculum',
          description: `¿Deseas ver el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
          action: () => { navigate(`/form/curriculum/preview/${row.original._id}`) }
        })
      }}>
        <ListItemIcon>
          <Eye />
        </ListItemIcon>
        Visualizar
      </MenuItem>,

      // descargar pdf
      <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Descargar curriculum',
          description: `¿Deseas descargar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
          action: () => { handleDownload(row.original) }
        })
      }}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        Descargar pdf
      </MenuItem>,

      // edit curriculum
      <MenuItem key={2} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Editar curriculum',
          description: `¿Deseas editar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
          action: () => { onChange(); navigate(`/form/curriculum/${row.original._id}`) }
        })
      }}>
        <ListItemIcon>
          <Update />
        </ListItemIcon>
        Actualizar
      </MenuItem>,

      // delete curriculum
      <MenuItem key={3} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          isDestructive: true,
          title: 'Eliminar curriculum',
          description: `¿Deseas eliminar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
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
      <Box sx={{ p: '8px', gap: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/** info selected rows */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} currículum(s) seleccionado(s)
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
              const firstEquipment = selectedRows[0].original.name
              const otherCount = selectedRows.length - 1
              confirmAction({
                title: 'Descargar currículums',
                description: `¿Deseas descargar los currículums de:
                ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} currículums` : ''}?`,
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
              const firstEquipment = selectedRows[0].original.name
              const otherCount = selectedRows.length - 1
              confirmAction({
                isDestructive: true,
                title: 'Eliminación múltiple',
                description: `¿Deseas eliminar los currículums:
                ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} currículums` : ''}?`,
                action: () => selectedRows.forEach(row => handleDelete(row.original._id))
              })
            }}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
    ),
    renderDetailPanel: ({ row }) => (// row details (Dropdown collapsible)
      <Box sx={{ gap: 2, boxShadow: 1, width: '100%', display: 'flex', borderRadius: 1, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', p: 1 }}>
          <Typography variant="h6">Historial de Mantenimientos</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Equipo: {row.original.name}
          </Typography>
        </Box>
        {row.original.childRows?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {row.original.childRows.map((maintenance) => (
              <Box
                key={maintenance._id}
                sx={{
                  p: 1.5,
                  borderLeft: 4,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeftColor: maintenance.isPreventive ? 'primary.main' : maintenance.typeMaintenance.includes('reacondicionamiento') ? 'burlywood' : 'grey.400',
                  bgcolor: !maintenance.isPreventive
                    ? maintenance.typeMaintenance.includes('reacondicionamiento') ? 'rgba(222, 184, 135, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(33, 150, 243, 0.1)',
                  '&:hover': {
                    bgcolor: !maintenance.isPreventive
                      ? maintenance.typeMaintenance.includes('reacondicionamiento') ? 'rgba(222, 184, 135, 0.15)' : 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(33, 150, 243, 0.15)'
                  }
                }}
              >
                {/** left content (info) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ px: 1, py: 0.25, color: 'white', borderRadius: 1, bgcolor: maintenance.isPreventive ? 'primary.main' : maintenance.typeMaintenance === 'correctivo' ? 'grey.500' : 'burlywood' }}>
                      {maintenance.typeMaintenance}
                    </Typography>
                    <Typography variant="caption" sx={{ px: 1, py: 0.25, color: 'white', borderRadius: 1, bgcolor: maintenance.statusEquipment !== 'funcionando' ? (maintenance.statusEquipment === 'en espera de repuestos' ? 'warning.main' : 'error.main') : 'success.main' }}>
                      {maintenance.statusEquipment}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.primary">
                    Fecha: {formatDate(maintenance.dateMaintenance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Observaciones: {maintenance.observations}
                  </Typography>
                </Box>

                {/** right content (buttons actions) */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => {
                      confirmAction({
                        title: 'Descargar mantenimiento',
                        description: `¿Deseas descargar el mantenimiento ${maintenance.typeMaintenance} "${maintenance.curriculum.name} - ${maintenance.curriculum.modelEquip}"?`,
                        action: () => handleDownloadMaintenance(maintenance)
                      })
                    }}
                  >
                    PDF
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    variant="outlined"
                    startIcon={<Update />}
                    onClick={() => {
                      confirmAction({
                        title: 'Editar mantenimiento',
                        description: `¿Deseas editar el mantenimiento ${maintenance.typeMaintenance} "${maintenance.curriculum.name} - ${maintenance.curriculum.modelEquip}"?`,
                        action: () => { onChange(); navigate(`/form/maintenance/${maintenance._id}`) }
                      })
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => {
                      confirmAction({
                        isDestructive: true,
                        title: 'Eliminar mantenimiento',
                        description: `¿Deseas eliminar el mantenimiento ${maintenance.typeMaintenance} "${maintenance.curriculum.name} - ${maintenance.curriculum.modelEquip}"?`,
                        action: () => { handleDeleteMaintenance(maintenance._id) }
                      })
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No hay mantenimientos adicionales para mostrar
          </Typography>
        )}
      </Box>
    )
  })

  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader
          size="lg"
          stats={stats}
          variant="gradient"
          icon={BookMarkedIcon}
          title="Equipos biomédicos"
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

export default TableCurriculumSection