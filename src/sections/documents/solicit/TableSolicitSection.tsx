import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, Chip, ListItemIcon, MenuItem, Paper, Typography } from "@mui/material"
import { Info as AlertCircle, FileText, BarChart2, Clock, PenTool } from "lucide-react"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import AlertDialog from "#/common/elements/AlertDialog"
import { Campaign, Delete } from "@mui/icons-material"
import { tableTranslations } from "@/utils/constants"
import { formatDateTime } from "@/utils/format"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { ThemeContextProps, Solicit } from "@/interfaces/context.interface"
import { useSolicitTable } from "@/hooks/core/table/useFormatTable"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

interface TableSolicitSectionProps extends ThemeContextProps {
  params?: { status?: string, name?: string, modelEquip?: string, createdAt?: string } | null
  onChange: () => void
}

/**
 * Permite construir un componente de tabla para mostrar los consultorios.
 * @param credentials - Credenciales del usuario
 * @param theme - El tema contexto de la aplicación
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los consultorios, posee una configuracion de columnas y un dropdown de acciones
 */
const TableSolicitSection = ({ theme, params }: TableSolicitSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { solicits, handleDelete } = useSolicitTable()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  /** Header stats */
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    href: `/form/solicit`,
    value: solicits?.length || 0,
    title: `Total de solicitudes`,
  }, {
    color: 'danger',
    icon: AlertCircle,
    title: 'Pendientes',
    value: solicits?.filter(s => s?.status === 'pendiente').length || 0,
    href: `/form/solicit/${getQueryParams({ data: { status: 'pendiente' } })}`,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<Solicit>[] = [{
      size: 200,
      id: "message",
      header: "Mensaje",
      accessorFn: (row) => row.message || 'Sin mensaje'
    }, {
      size: 150,
      id: "priority",
      header: "Prioridad",
      accessorFn: (row) => row.priority ? 'Urgente' : 'Normal'
    }, {
      size: 150,
      id: "status",
      header: "Estado",
      accessorFn: (row) => row.status || 'Sin estado'
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
    data: solicits || [],
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
      columnFilters: params ? [
        ...(params.status ? [{ id: 'status', value: params.status }] : []),
        ...(params.createdAt ? [{ id: 'createdAt', value: params.createdAt }] : [])
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
        // Delete solicit
        <MenuItem key={1} sx={{ m: 0 }} onClick={() => {
          closeMenu()
          confirmAction({
            isDestructive: true,
            title: 'Eliminar solicitud',
            description: `¿Deseas eliminar la solicitud "${row.original.message}"?`,
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
            {table.getSelectedRowModel().rows.length} solicitud(es) seleccionada(s)
          </Typography>
        </Box>
      </Box>
    ),
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------Row details dropdown--------------------------------------------------*/
    renderDetailPanel: ({ row: { original: solicit } }) => (// row details (Dropdown collapsible)
      <Box sx={{ gap: 2, boxShadow: 1, width: '100%', display: 'flex', borderRadius: 1, flexDirection: 'column' }}>
        {/* Panel top with details */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, bgcolor: 'background.paper' }}>
          {/* Column left */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Mensaje de solicitud:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">{solicit.message}</Typography>
            </Paper>
            <Typography variant="caption" color="text.secondary">
              Creado el {formatDateTime(solicit.createdAt)}
            </Typography>
          </Box>

          {/* Column right */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                color={solicit.priority ? 'error' : 'default'}
                label={solicit.priority ? 'URGENTE' : 'NORMAL'}
                icon={solicit.priority ? <AlertCircle size={14} /> : <Clock size={14} />}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                label={solicit.status.toUpperCase()}
                color={solicit.status === 'pendiente' ? 'warning' : (solicit.status === 'asignado' ? 'info' : 'success')}
              />
            </Box>
          </Box>
        </Box>

        {/* Panel bottom with details */}
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Detalles del equipo:
          </Typography>
          {solicit.curriculum ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              {/* Image of the equipment */}
              <Box sx={{ width: { xs: '100%', sm: 200 }, height: 200, position: 'relative' }}>
                <img
                  src={solicit.photoUrl || '/placeholder-image.jpg'}
                  alt={solicit.curriculum.name || 'Equipo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                />
              </Box>

              {/* Information of the equipment */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6">{solicit.curriculum.name}</Typography>
                <Typography variant="body2">
                  <strong>Marca:</strong> {solicit.curriculum.brand}
                </Typography>
                <Typography variant="body2">
                  <strong>Modelo:</strong> {solicit.curriculum.modelEquip}
                </Typography>
                <Typography variant="body2">
                  <strong>Serie:</strong> {solicit.curriculum.serie}
                </Typography>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<FileText size={16} />}
                    onClick={() => {
                      confirmAction({
                        title: 'Ver hoja de vida',
                        description: '¿Deseas ver la hoja de vida de este equipo?',
                        action: () => navigate(`/form/curriculum/preview/${solicit.curriculum._id}`)
                      })
                    }}
                  >
                    Ver hoja de vida
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PenTool size={16} />}
                    onClick={() => {
                      confirmAction({
                        title: 'Ver mantenimientos',
                        description: '¿Deseas ver los mantenimientos de este equipo?',
                        action: () => navigate(`/form/maintenance/${getQueryParams({ data: { name: solicit.curriculum.name, modelEquip: solicit.curriculum.modelEquip } })}`)
                      })
                    }}
                  >
                    Ver mantenimientos
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <AlertCircle size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <Typography>No hay equipo asociado a esta solicitud</Typography>
            </Box>
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
          stats={stats}
          icon={Campaign}
          variant="gradient"
          title="Solicitudes"
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

export default TableSolicitSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const getQueryParams = ({ data }: { [x: string]: any }) => {
  const params = { status: data.status, createdAt: data.createdAt, name: data.name, modelEquip: data.modelEquip }
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))
  return encodeURIComponent(JSON.stringify(filteredParams)) //Convert to codify url
}