import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/ui/card"
import { Maintenance, ThemeContextProps, User } from "@/interfaces/context.interface"
import AlertDialog from "#/common/elements/AlertDialog"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

import { useDialogConfirmContext } from "@/context/DialogConfirmContext"
import MaintenancePDF from "@/lib/export/MaintenancePDF"
import { CalendarIcon, EyeIcon } from "lucide-react"
import { usePDFDownload } from "@/lib/utils"
import { useRef, useCallback } from "react"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface MaintenanceHistoryProps extends ThemeContextProps { mt: Maintenance[], company: User }

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
      <Card className={cn('max-w-5xl mx-auto bg-gradient-to-br border', theme === 'dark' ? 'border-zinc-700 from-zinc-800 to-zinc-900' : 'border-purple-100 from-white to-purple-50/30')}>
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
                  <TableRow className={cn(theme === 'dark' ? 'bg-zinc-800/50' : 'bg-purple-50/50')}>
                    <TableHead className="w-[180px]">Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado del Equipo</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mt.map((maintenance) => (
                    <TableRow key={maintenance._id} className={cn('transition-colors hover:bg-muted/50', theme === 'dark' ? 'hover:bg-zinc-800/30' : 'hover:bg-purple-50/30')}>
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
            <div className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center', theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300')}>
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

export default MaintenanceHistory
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Función auxiliar para determinar el tipo de badge según el tipo de mantenimiento
const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('preventivo')) return "default";
  if (lowerType.includes('correctivo')) return "destructive";
  if (lowerType.includes('predictivo')) return "secondary";
  return "outline";
}