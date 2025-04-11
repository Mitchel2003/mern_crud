import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { BarChart2, BookMarkedIcon, CalendarClock, Eye, FileCogIcon } from 'lucide-react'
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { PageHeader, Stat } from '#/common/elements/HeaderPage'
import { Delete, Download, Update } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { Curriculum, Maintenance, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useCurriculumTable, useMaintenanceTable } from "@/hooks/core/table/useFormatTable"

import { generatePDF } from "@/lib/qrs/QRCodeGenerator"
import { tableTranslations } from "@/utils/constants"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/format"
import { useMemo } from "react"

interface TableCurriculumSectionProps extends ThemeContextProps {
  onChange: () => void
  credentials: User
}
interface CurriculumChildren extends Curriculum {
  childRows: (Maintenance & { isPreventive: boolean })[]
  hasMaintenances: boolean
}

/**
 * Permite construir un componente de tabla para mostrar los curriculums
 * @param credentials - Credenciales del usuario
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los curriculums, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCurriculumSection = ({ theme, credentials, onChange }: TableCurriculumSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { handleDownload: handleDownloadMaintenance, handleDelete: handleDeleteMaintenance } = useMaintenanceTable()
  const { curriculums: cvs, handleDelete, handleDownload, handleDownloadZip, handleDownloadZipMts } = useCurriculumTable()
  const isClient = credentials?.role === 'client'
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    value: cvs?.length || 0,
    href: '/form/curriculum',
    title: 'Total Equipos',
  }, {
    color: 'success',
    enabled: !isClient,
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: '/form/curriculum',
    value: cvs?.filter(c => c?.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] === today : false).length || 0,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<CurriculumChildren>[] = [{
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
      header: "Sede",
      id: "office.headquarter.name",
      accessorFn: (row) => row.office?.headquarter?.name || 'Sin sede'
    }];

    !isClient && array.push({// to show columns conditional
      size: 150,
      header: "Cliente",
      id: "office.headquarter.user.username",
      accessorFn: (row) => row.office?.headquarter?.user?.username || 'Sin cliente'
    }, {
      size: 90,
      header: "Riesgo",
      id: "riskClassification",
      accessorFn: (row) => row.riskClassification
    });
    return array
  }, [isClient])

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
      showColumnFilters: true,
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
      const baseItems = [// To show for all users (base)
        // View curriculum
        <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Ver Curriculum',
            description: `¿Deseas ver el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
            action: () => navigate(`/form/curriculum/preview/${row.original._id}`)
          })
        }}>
          <ListItemIcon> <Eye /> </ListItemIcon>
          Visualizar
        </MenuItem>,

        // Download curriculum
        <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Descargar curriculum',
            description: `¿Deseas descargar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
            action: () => handleDownload(row.original)
          })
        }}>
          <ListItemIcon> <Download /> </ListItemIcon>
          Descargar
        </MenuItem>
      ];

      const conditionalItems = !isClient ? [// To show only company, engineer and admin (conditional)
        // Edit curriculum
        <MenuItem key={2} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Editar curriculum',
            description: `¿Deseas editar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
            action: () => { onChange(); navigate(`/form/curriculum/${row.original._id}`) }
          })
        }}>
          <ListItemIcon> <Update /> </ListItemIcon>
          Actualizar
        </MenuItem>,

        // Delete curriculum
        <MenuItem key={3} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar curriculum',
            description: `¿Deseas eliminar el curriculum "${row.original.name} - ${row.original.modelEquip}"?`,
            action: () => handleDelete(row.original)
          })
        }}>
          <ListItemIcon> <Delete /> </ListItemIcon>
          Eliminar
        </MenuItem>
      ] : [];
      return [...baseItems, ...conditionalItems];
    },
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------Toolbar multi select--------------------------------------------------*/
    renderToolbarAlertBannerContent: ({ table }) => (// alert toolbar of rows selected (actions on multi select)
      <Box sx={{ p: '8px', gap: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/** info selected rows */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} currículum(s) seleccionado(s)
          </Typography>
        </Box>
        {/** actions rows selected */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          {/** Download currículums (ZIP) */}
          <Button
            size="small"
            color="primary"
            variant="outlined"
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

          {/** Download currículums + mantenimientos (ZIP) */}
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().flatRows
              const firstEquipment = selectedRows[0].original.name
              const otherCount = selectedRows.length - 1
              confirmAction({
                title: 'Descargar currículums + mantenimientos',
                description: `¿Deseas descargar los currículums de:
                  ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} currículums` : ''}?`,
                action: () => handleDownloadZipMts(selectedRows.map(row => row.original))
              })
            }}
          >
            Descargar ZIP + mantenimientos
          </Button>

          {/** Download QRs (ZIP) */}
          {!isClient && (
            <Button
              size="small"
              color="info"
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().flatRows
                const firstEquipment = selectedRows[0].original.name
                const otherCount = selectedRows.length - 1
                confirmAction({
                  title: 'Descargar QRs',
                  description: `¿Deseas descargar los QRs de:
                  ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} currículums` : ''}?`,
                  action: () => generatePDF(selectedRows.map(row => row.original))
                })
              }}
            >
              Descargar QRs
            </Button>
          )}
        </Box>
      </Box>
    ),
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------Row details dropdown--------------------------------------------------*/
    renderDetailPanel: ({ row }) => (// row details (Dropdown collapsible)
      <Box sx={{ gap: 2, boxShadow: 1, width: '100%', display: 'flex', borderRadius: 1, flexDirection: 'column' }}>
        {/** Card details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', p: 1 }}>
          <Typography variant="h6">Historial de Mantenimientos</Typography>
          {/** View maintenances associated*/}
          <Button
            size="small"
            color="info"
            variant="outlined"
            startIcon={<FileCogIcon />}
            onClick={() => {
              confirmAction({
                title: 'Ver mantenimientos',
                description: `¿Deseas ver los mantenimientos de ${row.original.name} - ${row.original.modelEquip}?`,
                action: () => navigate(`/form/maintenance/${getQueryParams({ data: row.original })}`)
              })
            }}
          >
            Ver mantenimientos
          </Button>

          {/** Badge info equipment */}
          <Typography variant="subtitle1" color="text.secondary">
            Equipo: {row.original.name}
          </Typography>
        </Box>

        {/** Child rows (maintenances) - sorted by date */}
        {row.original.childRows?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {row.original.childRows.map((maintenance) => (
              <Box
                key={maintenance._id}
                sx={{
                  p: 1.5, borderLeft: 4, borderRadius: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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

                  {/** actions with permissions */}
                  {!isClient && (
                    <>
                      {/** edit maintenance */}
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

                      {/** delete maintenance */}
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
                            action: () => handleDeleteMaintenance(maintenance._id)
                          })
                        }}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
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
          title={`Equipos ${!isMobile ? 'biomédicos' : ''}`}
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

export default TableCurriculumSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const getQueryParams = ({ data }: { [x: string]: any }) => {
  const filterParams = { name: data.name, modelEquip: data.modelEquip }
  return encodeURIComponent(JSON.stringify(filterParams)) //Convert to codify url
}