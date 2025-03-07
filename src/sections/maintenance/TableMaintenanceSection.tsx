import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { Update, Delete, Download } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Maintenance, ThemeContextProps } from "@/interfaces/context.interface"
import { useMaintenanceTable } from "@/hooks/auth/useFormatForm"

import { tableTranslations } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/format"
import { useEffect, useMemo } from "react"

interface TableMaintenanceSectionProps extends ThemeContextProps {
  setOnFetch: (data: Maintenance[]) => void
  onChange: () => void
}

interface MaintenanceWithChildren extends Maintenance {
  childRows: (Maintenance & { isPreventive: boolean })[]
}

/**
 * Permite construir un componente de tabla para mostrar los mantenimientos
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, setOnFetch, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { core, maintenances, handleDelete, handleDownload, handleDownloadZip } = useMaintenanceTable()
  const navigate = useNavigate()

  useEffect(() => { setOnFetch(core || []) }, [core, setOnFetch]) //to render data on parent

  const columns = useMemo<MRT_ColumnDef<MaintenanceWithChildren>[]>(() => [{
    size: 150,
    header: 'Equipo',
    id: 'curriculum.name',
    accessorFn: (row) => row.curriculum.name,
  }, {
    size: 100,
    header: "Modelo",
    id: "curriculum.modelEquip",
    accessorFn: (row) => row?.curriculum?.modelEquip || 'Sin modelo'
  }, {
    size: 200,
    header: "Cliente",
    id: "curriculum.office.headquarter.client.name",
    accessorFn: (row) => row?.curriculum?.office?.headquarter?.client?.name || 'Sin cliente'
  }, {
    size: 150,
    id: "dateNextMaintenance",
    header: "Prox. mantenimiento",
    accessorFn: (row) => formatDate(row.dateNextMaintenance)
  }, {
    size: 100,
    header: "Estado",
    id: "statusEquipment",
    accessorFn: (row) => row.statusEquipment
  }], [])

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
    muiTableContainerProps: {//table container (inside)
      sx: { maxHeight: '100%', maxWidth: '100%', overflow: 'auto' }
    },
    muiTablePaperProps: {//table inside
      sx: { maxWidth: '100%', overflow: 'hidden' }
    },
    muiTableProps: {//table inside (titles row)
      sx: { width: '100%', tableLayout: 'fixed' }
    },
    renderDetailPanel: ({ row }) => (// to show row details (Dropdown)
      <Box
        sx={{
          gap: 2,
          boxShadow: 1,
          width: '100%',
          display: 'flex',
          borderRadius: 1,
          flexDirection: 'column',
          bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', p: 1 }}>
          <Typography variant="h6">Historial de Mantenimientos</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Equipo: {row.original.curriculum.name}
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
                  borderLeftColor: maintenance.isPreventive ? 'success.main' : 'grey.400',
                  bgcolor: maintenance.isPreventive ? (theme === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)') : (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                  '&:hover': { bgcolor: maintenance.isPreventive ? (theme === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)') : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">
                      Fecha: {formatDate(maintenance.dateMaintenance)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.25,
                        color: 'white',
                        borderRadius: 1,
                        bgcolor: maintenance.isPreventive ? 'success.main' : 'grey.500',
                      }}
                    >
                      {maintenance.typeMaintenance}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {maintenance.statusEquipment} • Próximo: {formatDate(maintenance.dateNextMaintenance)}
                  </Typography>
                  {maintenance.observations && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Observaciones: {maintenance.observations}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => {
                      confirmAction({
                        title: 'Descargar mantenimiento',
                        description: `¿Deseas descargar el mantenimiento "${maintenance.curriculum.name}"?`,
                        action: () => handleDownload(maintenance)
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
                        description: `¿Deseas editar el mantenimiento "${maintenance.curriculum.name}"?`,
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
                        description: `¿Deseas eliminar el mantenimiento "${maintenance.curriculum.name}"?`,
                        action: () => { handleDelete(maintenance._id) }
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
    ),
    renderTopToolbar: ({ table }) => (// to define toolbar top (header toolbar)
      <Box
        sx={{
          p: '8px',
          gap: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
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
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ row, closeMenu }) => ([// to options row (actions for each row)
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
    renderToolbarAlertBannerContent: ({ table }) => (// to alert banner of rows selected (actions on multi select)
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
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} mantenimiento(s) seleccionado(s)
          </Typography>
        </Box>
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
                description: `¿Deseas descargar todos los mantenimientos de:
                ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} equipos` : ''}?
                Se incluirán todos los mantenimientos históricos de cada equipo.`,
                action: () => handleDownloadZip(selectedRows.flatMap(row => [row.original, ...row.original.childRows]))
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
      </Box >
    )
  })

  return (
    <>
      <MaterialReactTable table={table} />

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