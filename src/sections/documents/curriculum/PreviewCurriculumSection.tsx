import { Curriculum, Maintenance, Inspection, Accessory, ThemeContextProps, User } from "@/interfaces/context.interface"
import { useDialogConfirmContext } from "@/context/DialogConfirmContext"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import MaintenancePDF from "@/lib/export/MaintenancePDF"
import { CalendarIcon, EyeIcon } from "lucide-react"
import { usePDFDownload } from "@/lib/utils"
import { useRef, useCallback } from "react"
import { es } from "date-fns/locale"
import { format } from "date-fns"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/ui/card"
import MaintenancePreviewCV from "#/pages/documents/curriculum/MaintenancePreviewCV"
import EquipmentPreviewCV from "#/pages/documents/curriculum/EquipmentPreviewCV"
import DetailsPreviewCV from "#/pages/documents/curriculum/DetailsPreviewCV"
import ClientPreviewCV from "#/pages/documents/curriculum/ClientPreviewCV"
import FooterPreviewCV from "#/pages/documents/curriculum/FooterPreviewCV"
import HeaderPreviewCV from "#/pages/documents/curriculum/HeaderPreviewCV"
import AlertDialog from "#/common/elements/AlertDialog"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { cn } from "@/lib/utils"

interface PreviewCurriculumSectionProps extends ThemeContextProps {
  isMobile: boolean
  id: string
}

const PreviewCurriculumSection = ({ id, theme, isMobile }: PreviewCurriculumSectionProps) => {
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  /** basic data equipment, references company and client */
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: com, isLoading: isLoadingCom } = queryUser.fetchUserByQuery<User>({ role: 'company' })
  const { data: mt, isLoading: isLoadingMt } = queryFormat.fetchFormatByQuery<Maintenance>('maintenance', { curriculum: id })
  const client = cv?.office?.headquarter?.user
  const company = com?.[0] as User

  /** complementaries curriculum */
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string, { enabled: !!cv })
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const isLoadingData = isLoadingCv || isLoadingMt || isLoadingAcc || isLoadingIns || isLoadingCom
  if (isLoadingData) return <Skeleton theme={theme} />
  return (
    <div className="container p-2 space-y-4">
      {cv && (
        <>
          <Card className={cn('max-w-5xl mx-auto bg-gradient-to-br', theme === 'dark'
            ? 'border-purple-100 from-gray-800 to-gray-900'
            : 'border-purple-100 from-white to-purple-50/30'
          )}>
            <HeaderPreviewCV theme={theme} client={client} isMobile={isMobile} />
            <CardContent className="grid gap-6 px-4 sm:px-6">
              {/*** Info of client ***/}
              <ClientPreviewCV theme={theme} cv={cv} client={client} />
              {/*** Basic data, class biomedical and accessories associated ***/}
              <EquipmentPreviewCV theme={theme} cv={cv} accs={acc} />
              {/*** Details associated and stakeholders ***/}
              <DetailsPreviewCV theme={theme} cv={cv} />
              {/*** Info of maintenance, inspection and specifications ***/}
              <MaintenancePreviewCV theme={theme} cv={cv} ins={ins} />
              {/*** Characteristics and provider service information ***/}
              <FooterPreviewCV theme={theme} cv={cv} com={company} />
            </CardContent>
          </Card>
          {mt && <MaintenanceHistory theme={theme} mt={mt} company={company} />}
        </>
      )}
    </div>
  )
}

export default PreviewCurriculumSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface MaintenanceHistoryProps extends ThemeContextProps { mt: Maintenance[], company: User }
const MaintenanceHistory = ({ theme, mt, company }: MaintenanceHistoryProps): JSX.Element => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirmContext()
  const { downloadPDF } = usePDFDownload()
  const isProcessing = useRef(false)

  /**
   * Función para descargar y visualizar el PDF de un mantenimiento
   * @param {Maintenance} maintenance - Mantenimiento a visualizar/descargar
   */
  const handleDownloadPDF = useCallback(async (maintenance: Maintenance) => {
    if (isProcessing.current) { return } isProcessing.current = true
    try { await downloadPDF({ fileName: 'maintenance', component: MaintenancePDF, props: { mt: maintenance, com: company } }) }
    finally { isProcessing.current = false }
  }, [downloadPDF, company])
  return (
    <>
      <Card className={cn('max-w-5xl mx-auto bg-gradient-to-br', theme === 'dark'
        ? 'border-purple-100 from-gray-800 to-gray-900'
        : 'border-purple-100 from-white to-purple-50/30'
      )}>
        <CardHeader className="px-4 sm:px-6 pt-6 pb-0">
          <CardTitle className="text-xl font-semibold">
            Historial de Mantenimientos
          </CardTitle>
          <CardDescription>
            Registro de mantenimientos realizados al equipo
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {mt.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className={cn(
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-purple-50/50'
                  )}>
                    <TableHead className="w-[180px]">Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado del Equipo</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mt.map((maintenance) => (
                    <TableRow key={maintenance._id} className={cn(
                      'transition-colors hover:bg-muted/50',
                      theme === 'dark' ? 'hover:bg-gray-800/30' : 'hover:bg-purple-50/30'
                    )}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(maintenance.dateMaintenance), 'dd MMM yyyy', { locale: es })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(maintenance.typeMaintenance)}>
                          {maintenance.typeMaintenance}
                        </Badge>
                      </TableCell>
                      <TableCell>{maintenance.statusEquipment}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  confirmAction({
                                    title: 'Ver mantenimiento',
                                    description: `¿Deseas ver el mantenimiento "${maintenance.curriculum.name}"?`,
                                    action: () => handleDownloadPDF(maintenance)
                                  })
                                }
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalles</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className={cn(
              'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
              theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
            )}>
              <h3 className="mt-2 text-sm font-semibold">No hay mantenimientos registrados</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Este equipo aún no tiene registros de mantenimiento en el sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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

// Función auxiliar para determinar el tipo de badge según el tipo de mantenimiento
const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('preventivo')) return "default";
  if (lowerType.includes('correctivo')) return "destructive";
  if (lowerType.includes('predictivo')) return "secondary";
  return "outline";
}