import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Info as AlertCircle, FileText, BarChart2, Clock, PenTool, BellRing } from "lucide-react"
import { Box, Button, Chip, ListItemIcon, MenuItem, Paper, Typography } from "@mui/material"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import AlertDialog from "#/common/elements/AlertDialog"
import { Campaign, Delete } from "@mui/icons-material"
import { tableTranslations } from "@/utils/constants"
import DialogSubmit from '#/common/elements/Dialog'
import SelectField from "#/common/fields/Select"
import { formatDateTime } from "@/utils/format"
import InputField from "#/common/fields/Input"
import DateField from "#/common/fields/Date"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { ThemeContextProps, Solicit } from "@/interfaces/context.interface"
import { useSolicitTable } from "@/hooks/core/table/useFormatTable"
import { useActivityForm } from "@/hooks/core/form/useFormatForm"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"

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
  const { methods, engineers, onSubmit } = useActivityForm(() => setShowDialog(false))
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [solicit, setSolicit] = useState<Solicit | null>(null)
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
      expanded: true,
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
      <Box sx={{ gap: 2, boxShadow: 2, width: '100%', display: 'flex', borderRadius: 1, flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header Banner with Status and Priority */}
        <Box sx={{ p: 2, display: 'flex', color: 'white', justifyContent: 'space-between', alignItems: 'center', bgcolor: solicit.status === 'pendiente' ? 'warning.main' : (solicit.status === 'asignado' ? 'info.main' : 'success.main') }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              Solicitud {solicit.status === 'pendiente' ? 'Pendiente' : (solicit.status === 'asignado' ? 'Asignada' : 'Completada')}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={solicit.priority ? 'URGENTE' : 'NORMAL'}
            icon={solicit.priority ? <AlertCircle size={14} color="white" /> : <Clock size={14} color="white" />}
            sx={{ color: 'white', fontWeight: 'bold', bgcolor: solicit.priority ? 'error.dark' : 'rgba(255,255,255,0.2)' }}
          />
        </Box>

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'background.paper' }}>
          {/* Left Column - Equipment Details */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', borderRight: { xs: 'none', md: '1px solid #eee' } }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileText size={20} /> Detalles del Equipo
            </Typography>

            {solicit.curriculum ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Equipment Image */}
                <Box sx={{ width: '100%', height: { xs: 200, sm: 250 }, borderRadius: 2, overflow: 'hidden', boxShadow: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey.100' }}>
                  <img
                    alt={solicit.curriculum.name || 'Equipo'}
                    src={solicit.photoUrl || '/placeholder-image.jpg'}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>

                {/* Equipment Details */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'primary.light', pb: 1 }}>
                    {solicit.curriculum.name}
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Marca</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.brand}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Modelo</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.modelEquip}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Serie</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.serie}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Fecha de Registro</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{formatDateTime(solicit.curriculum.createdAt)}</Typography>
                    </Box>
                  </Box>

                  {/* Action buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: 'start' }}>
                    <Button
                      size="small"
                      color="info"
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
                      Hoja de vida
                    </Button>

                    <Button
                      size="small"
                      color="warning"
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
                      Mantenimientos
                    </Button>

                    {solicit.status === 'pendiente' && (
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        startIcon={<BellRing size={16} />}
                        onClick={() => { setSolicit(solicit); setShowDialog(true) }}
                      >
                        Asignar actividad
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', bgcolor: 'grey.50', borderRadius: 2 }}>
                <AlertCircle size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <Typography>No hay equipo asociado a esta solicitud</Typography>
              </Box>
            )}
          </Box>

          {/* Right Column - Client and Request Details */}
          <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
            {/* Request Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', p: 0.5, borderRadius: '50%', bgcolor: 'secondary.main' }}>
                  <Box component="span" sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>S</Typography>
                  </Box>
                </Box>
                Detalles de la Solicitud
              </Typography>

              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Mensaje</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2">{solicit.message}</Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Fecha de Solicitud</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{formatDateTime(solicit.createdAt)}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">ID de Solicitud</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>{solicit._id.substring(0, 8)}...</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Client Information */}
            {solicit.curriculum?.office?.headquarter?.user && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', p: 0.5, borderRadius: '50%', bgcolor: 'primary.main' }}>
                    <Box component="span" sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>C</Typography>
                    </Box>
                  </Box>
                  Información del Cliente
                </Typography>

                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Cliente</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.office.headquarter.user.username}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.office.headquarter.user.phone || 'No disponible'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Consultorio</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.office.name}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Sede</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.office.headquarter.name}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, gridColumn: { xs: '1', sm: '1 / span 2' } }}>
                      <Typography variant="caption" color="text.secondary">Dirección</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{solicit.curriculum.office.headquarter.address}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    ),
  })
  /*---------------------------------------------------------------------------------------------------------*/

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

      {/* dialog activity */}
      <DialogSubmit
        theme={theme}
        iconSpan="info"
        title="Asignar Actividad"
        labelSubmit="Poner en marcha"
        description="Indica el operador que atendera la solicitud"
        onOpenChange={setShowDialog}
        form={{ methods, onSubmit }}
        open={showDialog}
        fields={[{
          name: "solicit",
          component: (
            <InputField
              hidden
              readOnly
              theme={theme}
              name="solicit"
              value={solicit?._id}
              label="ID de la solicitud"
            />
          )
        }, {
          name: "dateAssignment",
          component: (
            <DateField
              theme={theme}
              name="dateAssignment"
              label="Fecha de asignación"
              placeholder="Seleccione la fecha de asignación"
            />
          )
        }, {
          name: "engineer",
          component: (
            <SelectField
              theme={theme}
              name="engineer"
              label="Colaborador"
              options={engineers}
              placeholder={`Selecciona el encargado`}
            />
          )
        }]}
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