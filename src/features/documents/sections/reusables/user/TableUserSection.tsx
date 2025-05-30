import { MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable, MaterialReactTable, MRT_ColumnDef } from "material-react-table"
import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { RoleProps, ThemeContextProps, User } from "@/interfaces/context.interface"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { Delete, SupervisedUserCircle, Update } from "@mui/icons-material"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import { useUserTable } from "@/hooks/core/table/useAuthTable"
import { BarChart2, CalendarClock, Eye } from "lucide-react"
import AlertDialog from "#/common/elements/AlertDialog"
import { useIsMobile } from "@/hooks/ui/use-mobile"

import { convertRole, formatDateTime, toPlural } from "@/constants/format.constants"
import { tableTranslations } from "@/constants/values.constants"
import { encodeQueryParams } from "@/lib/query"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

interface TableUserSectionProps extends ThemeContextProps {
  params?: { createdAt?: string } | null
  onChange: () => void
  credentials: User
  to: RoleProps
}

/**
 * Permite construir un componente de tabla para mostrar los usuarios
 * @param credentials - Credenciales del usuario
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los usuarios, posee una configuracion de columnas y un dropdown de acciones
 */
const TableUserSection = ({ to, theme, params, credentials, onChange }: TableUserSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { users, handleDelete } = useUserTable(to)
  const isClient = credentials?.role === 'client'
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  /** Header stats */
  const today = new Date().toISOString().split('T')[0];
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    href: `/${toPlural(to)}`,
    value: users?.length || 0,
    title: `Total ${convertRole(to)}s`,
  }, {
    color: 'success',
    enabled: !isClient,
    icon: CalendarClock,
    title: 'Creados Hoy',
    href: `/${to}/${encodeQueryParams({ createdAt: formatDateTime(new Date(Date.now())) })}`,
    value: users?.filter(c => c?.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] === today : false).length || 0,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<User>[] = [{
      size: 100,
      id: 'name',
      header: 'Nombre',
      accessorFn: (row) => row.username,
    }, {
      size: 100,
      id: "phone",
      header: "Telefono",
      accessorFn: (row) => row.phone || 'Sin telefono'
    }, {
      size: 150,
      id: "email",
      header: "Email",
      accessorFn: (row) => row.email || 'Sin email'
    }];

    to === 'client' || to === 'company' && array.push({ //to show columns conditional
      size: 90,
      id: "nit",
      header: "NIT",
      accessorFn: (row) => row.nit || 'Sin Nit'
    });

    to === 'company' && array.push({ //to show columns conditional
      size: 90,
      id: "role",
      header: "Rol",
      accessorFn: (row) => row.belongsTo ? 'sub-proveedor' : 'proveedor'
    });

    array.push({ //to show column date created
      size: 90,
      id: "createdAt",
      header: "Creado",
      accessorFn: (row) => row.createdAt ? formatDateTime(row.createdAt) : 'Sin fecha'
    });
    return array
  }, [isClient])

  /** Table config (MRT) */
  const table = useMaterialReactTable({
    columns,
    data: users || [],
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
      const baseItems = to === 'client' ? [// To show for all users (base)
        // View user
        <MenuItem key={0} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Ver Usuario',
            description: `¿Deseas ver el usuario "${row.original.username}" con su historial?`,
            action: () => navigate(`/${to}/preview/${row.original._id}`)
          })
        }}>
          <ListItemIcon> <Eye /> </ListItemIcon>
          Visualizar
        </MenuItem>
      ] : [];

      const conditionalItems = !isClient ? [// To show only company, collaborator and admin (conditional)
        // Edit user
        <MenuItem key={2} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            title: 'Editar usuario',
            description: `¿Deseas editar el usuario "${row.original.username}"?`,
            action: () => { onChange(); navigate(`/${to}/${row.original._id}`) }
          })
        }}>
          <ListItemIcon> <Update /> </ListItemIcon>
          Actualizar
        </MenuItem>,

        // Delete user
        <MenuItem key={3} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar usuario',
            description: `¿Deseas eliminar el usuario "${row.original.username}"?`,
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
            {table.getSelectedRowModel().rows.length} usuario(s) seleccionado(s)
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
          variant="gradient"
          icon={SupervisedUserCircle}
          title={`${convertRole(to).charAt(0).toUpperCase() + convertRole(to).slice(1)}s`}
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

export default TableUserSection