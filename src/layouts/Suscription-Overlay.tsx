import { Card, CardContent, CardDescription, CardHeader } from "#/ui/card"
import { AlertTriangle, Database } from "lucide-react"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Badge } from "#/ui/badge"

interface SubscriptionOverlayProps { visible: boolean }
export default function SubscriptionOverlay({ visible }: SubscriptionOverlayProps) {
  if (!visible) return null
  return (
    <ScrollArea className="flex fixed inset-0 z-50 items-center justify-center p-4">
      {/* Backdrop borroso */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      <div className="flex items-center justify-center">
        {/* Tarjeta central */}
        <Card className="relative w-full max-w-2xl items-center justify-center shadow-2xl border-2 border-orange-200 bg-white">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Database className="h-8 w-8 text-orange-500" />
              <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
            </div>

            <div>
              <CardDescription className="text-lg mt-2">
                Sistema de Base de Datos - Notificación Automática
              </CardDescription>
            </div>

            <Badge variant="destructive" className="text-sm px-4 py-1">
              Acción Requerida Inmediatamente
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">


            <Separator />

            {/* Mensaje del sistema */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🔔 Notificación Automática del Sistema</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Nuestros servidores han detectado que el almacenamiento y procesamiento han alcanzado niveles críticos.
                Para mantener la estabilidad del sistema y evitar pérdida de datos, es necesario expandir la capacidad de
                la base de datos inmediatamente.
              </p>
            </div>

            {/* Consecuencias */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Impacto en el Servicio
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Búsquedas y consultas experimentarán lentitud</li>
                <li>• Riesgo de pérdida de datos por saturación</li>
                <li>• Funcionalidades limitadas hasta resolver el problema</li>
              </ul>
            </div>

            {/** Plan actual (gratuito) */}
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <h4 className="font-semibold text-zinc-900 mb-2">Plan Actual</h4>
              <div className="bg-white p-3 rounded border border-zinc-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-zinc-900">Plan Gratuit</span>
                  <Badge className="bg-zinc-600">Actual</Badge>
                </div>
                <div className="text-2xl font-bold text-zinc-900">
                  $0/mes
                  <span className="text-sm font-normal text-zinc-600 ml-2">(Limitado)</span>
                </div>
              </div>
            </div>

            {/* Solución */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ Solución Recomendada por el Sistema</h4>
              <p className="text-sm text-green-800 mb-3">
                Actualizar a un plan con mayor capacidad de almacenamiento y procesamiento para garantizar el
                funcionamiento óptimo del sistema.
              </p>

              <div className="bg-white p-3 rounded border border-green-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-green-900">Plan Profesional</span>
                  <Badge className="bg-green-600">Recomendado</Badge>
                </div>
                <ul className="text-sm text-green-700 space-y-1 mb-3">
                  <li>• Almacenamiento: 500 GB</li>
                  <li>• Mas usuarios en el sistema</li>
                  <li>• Procesamiento prioritario</li>
                </ul>
                <div className="text-2xl font-bold text-green-900">
                  $59.99/mes
                  <span className="text-sm font-normal text-green-600 ml-2">(Facturación del sistema)</span>
                </div>
              </div>
            </div>

            {/* Nota técnica */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              ID de Notificación: SYS-DB-2024-001 | Generado automáticamente por el sistema de monitoreo
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}