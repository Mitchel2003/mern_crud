import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton } from 'material-react-table'
import { Box, Button, ListItemIcon, MenuItem, Typography, lighten } from '@mui/material'
import { AccountCircle, Send } from '@mui/icons-material'
import { data } from './makeData'
import { useMemo } from 'react'

export type Employee = {
  email: string;
  salary: number;
  avatar: string;
  lastName: string;
  jobTitle: string;
  firstName: string;
  startDate: string;
  signatureCatchPhrase: string;
};

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(() => [{
    id: 'employee', //id used to define `group` column
    header: 'Employee',
    columns: [{
      accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
      size: 250,
      id: 'name', //id is still required when using accessorFn instead of accessorKey
      header: 'Name',
      Cell: ({ renderedCellValue, row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }} >
          <img
            alt="avatar"
            height={30}
            loading="lazy"
            src={row.original.avatar}
            style={{ borderRadius: '50%' }}
          />
          {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
          <span>{renderedCellValue}</span>
        </Box>
      ),
    }, {
      accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
      enableClickToCopy: true,
      filterVariant: 'autocomplete',
      header: 'Email',
      size: 300,
    }],
  }, {
    id: 'id',
    header: 'Job Info',
    columns: [{
      accessorKey: 'salary',
      // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
      filterFn: 'between',
      header: 'Salary',
      size: 200,
      //custom conditional format and styling
      Cell: ({ cell }) => (
        <Box
          component="span"
          sx={(theme) => ({
            backgroundColor:
              cell.getValue<number>() < 50_000
                ? theme.palette.error.dark
                : cell.getValue<number>() >= 50_000 &&
                  cell.getValue<number>() < 75_000
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
            borderRadius: '0.25rem',
            color: '#fff',
            maxWidth: '9ch',
            p: '0.25rem',
          })}
        >
          {cell.getValue<number>()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Box>
      ),
    }, {
      size: 350,
      header: 'Job Title',
      accessorKey: 'jobTitle', //hey a simple column for once
    }, {
      accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
      id: 'startDate',
      header: 'Start Date',
      filterVariant: 'date',
      filterFn: 'lessThan',
      sortingFn: 'datetime',
      muiFilterTextFieldProps: { sx: { minWidth: '250px' } },
      Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
    }],
  }], [])

  const table = useMaterialReactTable({
    columns,
    data,//data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
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
        <img
          alt="avatar"
          height={200}
          src={row.original.avatar}
          loading="lazy"
          style={{ borderRadius: '50%' }}
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4">Signature Catch Phrase:</Typography>
          <Typography variant="h1">
            &quot;{row.original.signatureCatchPhrase}&quot;
          </Typography>
        </Box>
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

  return <MaterialReactTable table={table} />
}

//Date Picker Imports - these should just be in your Context Provider
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ExampleWithLocalizationProvider = () => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
)

export default ExampleWithLocalizationProvider