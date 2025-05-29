import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "#/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/ui/tabs"
import { Curriculum } from "@/interfaces/context.interface"
import { Monitor, Wrench, Info } from "lucide-react"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { useState } from "react"

interface EquipmentDetailDialogProps {
  selectedCurriculum: (Curriculum & { status: string }) | null
  getEstadoBadgeColor: (estado: string) => string
  onOpenChange: (open: boolean) => void
  isOpen: boolean
}

/**
 * Diálogo modal que muestra información detallada de un equipo biomédico
 * Incluye pestañas para información general, especificaciones técnicas e historial de mantenimiento
 */
const EquipmentDetailDialog = ({ isOpen, selectedCurriculum, onOpenChange, getEstadoBadgeColor }: EquipmentDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("general")
  if (!selectedCurriculum) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Monitor className="h-5 w-5 text-purple-600" />
            {selectedCurriculum.name}
          </DialogTitle>
          <DialogDescription>
            Información detallada del equipo biomédico
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
          </TabsList>

          {/* Pestaña de Información General */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Datos Básicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={getEstadoBadgeColor(selectedCurriculum.status)}>
                      {selectedCurriculum.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Modelo:</span>
                    <span className="text-sm">{selectedCurriculum.modelEquip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Número de Serie:</span>
                    <span className="text-sm">{selectedCurriculum.serie}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fabricante:</span>
                    <span className="text-sm">{selectedCurriculum.manufacturer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ubicación:</span>
                    <span className="text-sm">{`${selectedCurriculum.office.name} - ${selectedCurriculum.office.headquarter.address}`}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Información de Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fecha de Adquisición:</span>
                    <span className="text-sm">{selectedCurriculum.datePurchase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Garantía:</span>
                    <span className="text-sm">{selectedCurriculum.warranty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Creado por:</span>
                    <span className="text-sm">{selectedCurriculum.createdBy.username}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Especificaciones */}
          <TabsContent value="specs" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Especificaciones Técnicas</CardTitle>
                <CardDescription>
                  Características detalladas del equipo biomédico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Info className="h-4 w-4 text-blue-500" />
                      Clasificación
                    </h4>
                    <div className="space-y-1 ml-5">
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span>Diagnóstico</span>
                      </p>
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Clase de riesgo:</span>
                        <span>IIB</span>
                      </p>
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Uso:</span>
                        <span>Clínico</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Wrench className="h-4 w-4 text-blue-500" />
                      Mantenimiento
                    </h4>
                    <div className="space-y-1 ml-5">
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Frecuencia:</span>
                        <span>Trimestral</span>
                      </p>
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span>Preventivo</span>
                      </p>
                      <p className="text-xs flex justify-between">
                        <span className="text-muted-foreground">Calibración:</span>
                        <span>Anual</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recomendaciones del Fabricante</h4>
                  <p className="text-xs text-muted-foreground">
                    Realizar limpieza mensual de componentes internos. Mantener en ambiente controlado
                    con temperatura entre 18°C y 24°C. Verificar conexiones eléctricas cada 3 meses.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentDetailDialog