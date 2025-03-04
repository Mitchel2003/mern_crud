import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, lighten, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { AccountCircle, Send } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Country, ThemeContextProps } from "@/interfaces/context.interface"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { formatDate } from "@/utils/constants"
import { useMemo } from "react"

interface TableCountrySectionProps extends ThemeContextProps { onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los países
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los países, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCountrySection = ({ theme }: TableCountrySectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { data: countries } = useQueryLocation().fetchAllLocations<Country>('country')

  const columns = useMemo<MRT_ColumnDef<Country>[]>(() => [{
    size: 250,
    id: 'name',
    header: 'Nombre del país',
    accessorFn: (row) => row.name,
  }, {
    size: 250,
    id: 'updatedAt',
    header: 'Última actualización',
    accessorFn: (row) => new Date(row.updatedAt).toLocaleString('es-ES', formatDate)
  }], [])

  const table = useMaterialReactTable({
    columns,
    data: countries || [],//data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableRowActions: true,
    enableGrouping: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: { left: ['mrt-row-expand', 'mrt-row-select'], right: ['mrt-row-actions'] },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      variant: 'outlined',
      size: 'small',
    },
    muiPaginationProps: {
      shape: 'rounded',
      color: 'secondary',
      variant: 'outlined',
      rowsPerPageOptions: [10, 20, 30],
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          left: '30px',
          width: '100%',
          display: 'flex',
          maxWidth: '1000px',
          position: 'sticky',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Typography variant="h4">Detalle del país</Typography>
        <Typography variant="h1">{row.original.name}</Typography>
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        sx={{ m: 0 }}
        onClick={() => {/* View profile logic...*/ closeMenu() }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Profile
      </MenuItem>,
      <MenuItem
        key={1}
        sx={{ m: 0 }}
        onClick={() => {/* Send email logic... */ closeMenu() }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Send Email
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => alert('deactivating ' + row.getValue('name')))
      }

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => alert('activating ' + row.getValue('name')))
      }

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => alert('contact ' + row.getValue('name')))
      }

      return (
        <Box
          sx={(theme) => ({
            p: '8px',
            gap: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: lighten(theme.palette.background.default, 0.05),
          })}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
                variant="contained"
              >
                Deactivate
              </Button>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Activate
              </Button>
              <Button
                color="info"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
                variant="contained"
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>
      )
    }
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

export default TableCountrySection