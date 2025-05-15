import { MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable, MaterialReactTable, MRT_ColumnDef } from "material-react-table"
import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { ThemeContextProps, City } from "@/interfaces/context.interface"
import { Delete, LocationCity, Update } from "@mui/icons-material"
import { useCityTable } from "@/hooks/core/table/useLocationTable"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import AlertDialog from "#/common/elements/AlertDialog"
import { useIsMobile } from "@/hooks/ui/use-mobile"

import { tableTranslations } from "@/constants/values.constants"
import { formatDateTime } from "@/constants/format.constants"
import { BarChart2, CalendarClock } from "lucide-react"
import { encodeQueryParams } from "@/lib/query"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

interface TableCitySectionProps extends ThemeContextProps {
  params?: { createdAt?: string } | null
  onChange: () => void
}

/**
 * Permite construir un componente de tabla para mostrar las ciudades
 * @param theme - El tema contexto de la aplicación
 * @param params - Parametros de la ruta
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con las ciudades, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCitySection = ({ theme, params, onChange }: TableCitySectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { cities, handleDelete } = useCityTable()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    href: `/location/city`,
    value: cities?.length || 0,
    title: `Total ciudades`,
  }, {
    color: 'success',
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: `/location/city/${encodeQueryParams({ createdAt: formatDateTime(new Date(Date.now())) })}`,
    value: cities?.filter(s => s?.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] === today : false).length || 0,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<City>[] = [{
      size: 100,
      id: 'name',
      header: 'Nombre',
      accessorFn: (row) => row.name,
    }, {
      size: 100,
      id: 'state.name',
      header: 'Departamento',
      accessorFn: (row) => row.state?.name || 'Sin departamento'
    }, {
      size: 100,
      id: "createdAt",
      header: "Fecha de creación",
      accessorFn: (row) => formatDateTime(row.createdAt)
    }];
    return array
  }, [])

  /** Table config (MRT) */
  const table = useMaterialReactTable({
    columns,
    data: cities || [],
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
      columnFilters: params ? [...(params.createdAt ? [{ id: 'createdAt', value: params.createdAt }] : [])] : []
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
        // Edit city
        <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Editar ciudad',
            description: `¿Deseas editar la ciudad "${row.original.name}"?`,
            action: () => { onChange(); navigate(`/location/city/${row.original._id}`) }
          })
        }}>
          <ListItemIcon> <Update /> </ListItemIcon>
          Actualizar
        </MenuItem>,

        // Delete city
        <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar ciudad',
            description: `¿Deseas eliminar la ciudad "${row.original.name}"?`,
            action: () => handleDelete(row.original._id)
          })
        }}>
          <ListItemIcon> <Delete /> </ListItemIcon>
          Eliminar
        </MenuItem>
      ];
      return [...baseItems]
    },
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------Toolbar multi select--------------------------------------------------*/
    renderToolbarAlertBannerContent: ({ table }) => (// alert toolbar of rows selected (actions on multi select)
      <Box sx={{ p: '8px', gap: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/** info selected rows */}
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography>
            {table.getSelectedRowModel().rows.length} ciudad(es) seleccionada(s)
          </Typography>
        </Box>
      </Box>
    )
  })

  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader
          size="lg"
          stats={stats}
          title="Ciudades"
          variant="gradient"
          icon={LocationCity}
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

export default TableCitySection