import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import AlertDialog from "#/common/elements/AlertDialog"
import { Update, Delete } from "@mui/icons-material"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { Country, ThemeContextProps } from "@/interfaces/context.interface"
import { useCountryTable } from "@/hooks/auth/useLocationForm"

import { tableTranslations } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils/format"
import { useMemo } from "react"

interface TableCountrySectionProps extends ThemeContextProps { onChange: (value: string) => void }

/**
 * Permite construir un componente de tabla para mostrar los países
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los países, posee una configuracion de columnas y un dropdown de acciones
 */
const TableCountrySection = ({ theme, onChange }: TableCountrySectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { data: countries } = useQueryLocation().fetchAllLocations<Country>('country')
  const { deleteLocation: deleteCountry } = useLocationMutation("country")
  const { handleDelete } = useCountryTable()
  const navigate = useNavigate()

  const columns = useMemo<MRT_ColumnDef<Country>[]>(() => [{
    size: 250,
    id: 'name',
    header: 'Nombre del país',
    accessorFn: (row) => row.name,
  }, {
    size: 250,
    id: 'updatedAt',
    header: 'Última actualización',
    accessorFn: (row) => formatDate(row.updatedAt)
  }], [])

  const table = useMaterialReactTable({
    columns,
    data: countries || [],
    localization: tableTranslations,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableRowActions: true,
    enableGrouping: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: { left: ['mrt-row-select', 'mrt-row-expand'], right: ['mrt-row-actions'] },
    },
    positionToolbarAlertBanner: 'head-overlay',
    paginationDisplayMode: 'pages',
    muiPaginationProps: {
      shape: 'rounded',
      color: 'secondary',
      variant: 'outlined',
      rowsPerPageOptions: [10, 20, 30],
    },
    renderDetailPanel: ({ row }) => (// to show row details (Dropdown)
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
        <Typography variant="h6">Detalle del país</Typography>
        <Typography variant="body1">{row.original.name}</Typography>
      </Box>
    ),
    renderTopToolbar: ({ table }) => (// to define top toolbar (customizable)
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
    renderRowActionMenuItems: ({ row, closeMenu }) => ([// to row actions (options for each row)
      <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          title: 'Editar Pais',
          description: `¿Deseas editar el pais "${row.original.name}"?`,
          action: () => { onChange('form'); navigate(`/location/country/${row.original._id}`) }
        })
      }}>
        <ListItemIcon>
          <Update />
        </ListItemIcon>
        Actualizar
      </MenuItem>,
      <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
        closeMenu()
        confirmAction({
          isDestructive: true,
          title: 'Eliminar Pais',
          description: `¿Deseas eliminar el pais "${row.original.name}"?`,
          action: () => { handleDelete(row.original._id) }
        })
      }}>
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Eliminar
      </MenuItem>,
    ]),
    renderToolbarAlertBannerContent: ({ table }) => (// to alert banner of rows selected (multi select)
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
            {table.getSelectedRowModel().rows.length} país(es) seleccionado(s)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => {
              confirmAction({
                isDestructive: true,
                title: 'Eliminación multiple',
                description: `¿Deseas eliminar estos paises: ${table.getSelectedRowModel().flatRows.map((row) => row.original.name).join(', ')}?`,
                action: () => { table.getSelectedRowModel().flatRows.map(async (row) => await deleteCountry({ id: row.original._id })) }
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

export default TableCountrySection