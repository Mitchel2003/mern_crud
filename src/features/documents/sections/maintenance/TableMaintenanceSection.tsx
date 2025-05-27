import { MaterialReactTable, MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton, useMaterialReactTable } from "material-react-table"
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material"
import { BarChart2, Clock, AlertTriangle, Wrench, Eye } from "lucide-react"
import { PageHeader, Stat } from "#/common/elements/HeaderPage"
import { Update, Delete, Download } from "@mui/icons-material"
import AlertDialog from "#/common/elements/AlertDialog"
import ImagePreview from "#/common/fields/ImagePreview"
import CardIterable from "#/common/fields/CardIterable"
import SignatureField from "#/common/fields/Signature"
import DialogSubmit from '#/common/elements/Dialog'
import ImageField from "#/common/fields/Image"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { Maintenance, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useSignMaintenanceForm } from "@/hooks/core/form/useLocationForm"
import { useMaintenanceTable } from "@/hooks/core/table/useFormatTable"
import { tableTranslations } from "@/constants/values.constants"
import { formatDateTime } from "@/constants/format.constants"
import { useNotification } from "@/hooks/ui/useNotification"
import { DialogField } from "@/interfaces/props.interface"
import { useIsMobile } from "@/hooks/ui/use-mobile"

import { encodeQueryParams } from "@/lib/query"
import { UseFormReturn } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface TableMaintenanceSectionProps extends ThemeContextProps {
  params?: { name?: string; modelEquip?: string; statusEquipment?: string } | null
  onChange: () => void
  isHistory?: boolean
  credentials: User
}

/**
 * Permite construir un componente de tabla para mostrar los mantenimientos
 * @param theme - El tema contexto de la aplicación
 * @param params - Parámetros para filtrar la tabla de mantenimientos
 * @param onChange - Funcion setTab que permite cambiar entre las pestañas tabs
 * @returns react-query table con los formatos, posee una configuracion de columnas y un dropdown de acciones
 */
const TableMaintenanceSection = ({ theme, params, credentials, isHistory, onChange }: TableMaintenanceSectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { maintenances: mts, handleDelete, handleDownload, handleDownloadZip } = useMaintenanceTable()
  const [showDialog, setShowDialog] = useState<Maintenance[] | undefined>(undefined)
  const isClient = credentials?.role === 'client'
  const { notifyWarning } = useNotification()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const maintenances = useMemo(() => (mts.filter(m => isHistory || isClient ? !!m.signature : !m.signature)), [isHistory, mts])
  const { methods, open, setOpen, onConfirm, handleSubmit } = useSignMaintenanceForm(showDialog, () => setShowDialog(undefined))

  /** Header stats */
  const stats: Stat[] = [{
    color: 'info',
    icon: BarChart2,
    title: 'Total Mantenimientos',
    value: maintenances?.length || 0,
    href: `/form/${isHistory ? 'maintenance-history' : 'maintenance'}`,
  }, {
    icon: Clock,
    color: 'warning',
    title: 'En Espera de Repuestos',
    value: maintenances?.filter(m => m.statusEquipment === 'en espera de repuestos').length || 0,
    href: `/form/${isHistory ? 'maintenance-history' : 'maintenance'}/${encodeQueryParams({ statusEquipment: 'en espera de repuestos' })}`,
  }, {
    color: 'danger',
    icon: AlertTriangle,
    title: 'Fuera de Servicio',
    value: maintenances?.filter(m => m.statusEquipment === 'fuera de servicio').length || 0,
    href: `/form/${isHistory ? 'maintenance-history' : 'maintenance'}/${encodeQueryParams({ statusEquipment: 'fuera de servicio' })}`,
  }]

  /** Config table columns */
  const columns = useMemo(() => {
    const array: MRT_ColumnDef<Maintenance>[] = [{
      header: 'Equipo',
      id: 'curriculum.name',
      size: isMobile ? 70 : 80,
      accessorFn: (row) => row.curriculum.name,
    }, {
      header: "Modelo",
      size: isMobile ? 50 : 60,
      id: "curriculum.modelEquip",
      accessorFn: (row) => row.curriculum?.modelEquip || 'Sin modelo'
    }, {
      header: "Sede",
      size: isMobile ? 50 : 60,
      id: "curriculum.office.headquarter.name",
      accessorFn: (row) => row.curriculum?.office?.headquarter?.name || 'Sin sede'
    }];

    !isClient && array.push({// to show columns conditional
      header: "Cliente",
      size: isMobile ? 70 : 80,
      id: "curriculum.office.headquarter.client.username",
      accessorFn: (row) => row.curriculum?.office?.headquarter?.client?.username || 'Sin cliente'
    })

    array.push({
      header: "Servicio",
      id: "curriculum.service",
      size: isMobile ? 60 : 80,
      accessorFn: (row) => row.curriculum?.service
    }, {
      header: "Consultorio",
      size: isMobile ? 60 : 80,
      id: "curriculum.office.name",
      accessorFn: (row) => row.curriculum?.office?.name
    }, {
      header: "Estado",
      id: "statusEquipment",
      size: isMobile ? 50 : 80,
      accessorFn: (row) => row.statusEquipment || 'Sin estado'
    }, {
      header: "Prox. mt",
      id: "dateNextMaintenance",
      size: isMobile ? 50 : 80,
      accessorFn: (row) => row?.dateNextMaintenance ? formatDateTime(row.dateNextMaintenance) : 'Sin fecha'
    })
    return array
  }, [isMobile, isClient])

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
            Descargar
          </Button>
          {/** Sign maintenance (ZIP) */}
          {!isHistory && !isClient && (
            <Button
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().flatRows
                const someSigned = selectedRows.some(row => row.original.signature)
                const headquarters = selectedRows.map(row => row.original.curriculum.office.headquarter.name)
                if (new Set(headquarters).size > 1) return notifyWarning({ title: '☣️ Más de una sede seleccionada', message: 'En la firma multiple, los documentos deben pertenecer a la misma sede' })
                if (someSigned) return notifyWarning({ title: '☣️ Algunos documentos ya están firmados', message: 'No se puede firmar documentos que ya están firmados' })
                setShowDialog(selectedRows.map(row => row.original))
              }}
            >
              Firmar documentos
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
          title={`${!isMobile && isHistory ? 'Historial de' : ''} Mantenimientos`}
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

      {/* dialog signature */}
      <DialogSubmit
        theme={theme}
        iconSpan="info"
        methods={methods}
        open={!!showDialog}
        labelSubmit="Firmar"
        title="Firmar documentos"
        fields={fields({ methods, theme })}
        onOpenChange={() => setShowDialog(undefined)}
        description="Indica la firma que aprobará los documentos"
        onOpenAlertDialogChange={setOpen}
        handleSubmit={handleSubmit}
        openAlertDialog={open}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default TableMaintenanceSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface Props extends ThemeContextProps { methods: UseFormReturn<any> }
/** Permite construir un array de campos para el dialogo de asignacion de actividad */
const fields = ({ methods, theme }: Props): DialogField[] => {
  const watchSignature = methods.watch('signature') || [];
  const watchImage = methods.watch('image') || [];

  const hasSignature = watchSignature.length > 0;
  const hasImage = watchImage.length > 0;
  return [{
    name: "preview",
    component: (
      <ImagePreview
        theme={theme}
        name="preview"
        alt="imgEquip"
        sizeImage='max-w-full max-h-72'
        className={cn(hasImage || hasSignature ? 'hidden' : 'block')}
      />
    )
  }, {
    name: "signature",
    component: (
      <CardIterable
        limit={1}
        theme={theme}
        name="signature"
        disabled={hasImage}
        titleButton="Añadir firma digital"
        fields={fieldsSignature.map(field => ({ name: field.name, component: <SignatureField {...field} theme={theme} /> }))}
      />
    )
  }, {
    name: "image",
    component: (
      <CardIterable
        limit={1}
        name="image"
        theme={theme}
        disabled={hasSignature}
        titleButton="Añadir imagen de la firma"
        fields={fieldsImage.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
      />
    )
  }]
}

/** Allow us reference to the fields associated with the signature and image */
const fieldsImage = [{ name: "image.ref", label: "Imagen de la firma", sizeImage: "w-60 h-60" }]
const fieldsSignature = [{ name: "signature.ref", label: "Firma digital", height: 150, showDownload: false }]