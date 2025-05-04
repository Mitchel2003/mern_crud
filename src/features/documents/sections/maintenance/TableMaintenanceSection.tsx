import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { BarChart2, Clock, AlertTriangle, Wrench, Eye } from "lucide-react"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import { Update, Delete, Download } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Maintenance, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useMaintenanceTable } from "@/hooks/core/table/useFormatTable"

import { tableTranslations } from "@/constants/values.constants"
import { formatDateTime } from "@/constants/format.constants"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { encodeQueryParams } from "@/lib/query"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

interface TableMaintenanceSectionProps extends ThemeContextProps {
  params?: { name?: string; modelEquip?: string; statusEquipment?: string } | null
  onChange: () => void
  credentials: User
}

/**
 * Permite construir un componente de tabla para mostrar los mantenimientos
 * @param theme - El tema contexto de la aplicación
 * @param params - Parámetros para filtrar la tabla de mantenimientos
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, params, credentials, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { maintenances, handleDelete, handleDownload, handleDownloadZip } = useMaintenanceTable()
  const isClient = credentials?.role === 'client'
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    href: '/form/maintenance',
    title: 'Total Mantenimientos',
    value: maintenances?.length || 0,
  }, {
    icon: Clock,
    color: 'warning',
    title: 'En Espera de Repuestos',
    value: maintenances?.filter(m => m.statusEquipment === 'en espera de repuestos').length || 0,
    href: `/form/maintenance/${encodeQueryParams({ statusEquipment: 'en espera de repuestos' })}`,
  }, {
    color: 'danger',
    icon: AlertTriangle,
    title: 'Fuera de Servicio',
    value: maintenances?.filter(m => m.statusEquipment === 'fuera de servicio').length || 0,
    href: `/form/maintenance/${encodeQueryParams({ statusEquipment: 'fuera de servicio' })}`,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<Maintenance>[] = [{
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
      id: "curriculum.office.headquarter.client.username",
      accessorFn: (row) => row?.curriculum?.office?.headquarter?.client?.username || 'Sin cliente'
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
    }];

    // to show columns conditional
    isClient && array.splice(2, 1)
    return array
  }, [isClient])

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
        ...(params.modelEquip ? [{ id: 'curriculum.modelEquip', value: params.modelEquip }] : []),
        ...(params.statusEquipment ? [{ id: 'statusEquipment', value: params.statusEquipment }] : [])
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
      const baseItems = [// To show for all users (base)
        // download pdf
        <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Ver mantenimiento',
            description: `¿Deseas ver el mantenimiento "${row.original.curriculum.name}"?`,
            action: () => handleDownload(row.original)
          })
        }}>
          <ListItemIcon> <Eye /> </ListItemIcon>
          Ver
        </MenuItem>
      ];

      const conditionalItems = !isClient ? [// To show all users except client (conditional)
        // edit maintenance
        <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Editar mantenimiento',
            description: `¿Deseas editar el mantenimiento "${row.original.curriculum.name}"?`,
            action: () => { onChange(); navigate(`/form/maintenance/${row.original._id}`) }
          })
        }}>
          <ListItemIcon> <Update /> </ListItemIcon>
          Actualizar
        </MenuItem>,

        // delete maintenance
        <MenuItem key={2} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar mantenimiento',
            description: `¿Deseas eliminar el mantenimiento "${row.original.curriculum.name}"?`,
            action: () => handleDelete(row.original._id)
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
            {table.getSelectedRowModel().rows.length} mantenimiento(s) seleccionado(s)
          </Typography>
        </Box>
        {/** actions rows selected */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          {/** Download maintenance (ZIP) */}
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

          {/** Delete maintenance */}
          {!isClient && (
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
                  description: `¿Deseas eliminar los mantenimientos de: ${firstEquipment}${otherCount > 0 ? ` y otros ${otherCount} equipos` : ''}?`,
                  action: () => selectedRows.forEach(row => handleDelete(row.original._id))
                })
              }}
            >
              Eliminar
            </Button>
          )}
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
          title={`${!isMobile ? 'Historial de' : ''} Mantenimientos`}
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

export default TableMaintenanceSection