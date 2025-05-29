import { Calendar, ClipboardList, Copy, DollarSign, Factory, Mail, PenTool, Play, Shield, ShoppingCart, Truck, UserCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/ui/card"
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { cn, copyToClipboard } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

export interface DetailsPreviewCVProps extends ThemeContextProps { cv: Curriculum }

const DetailsPreviewCV = ({ cv, theme }: DetailsPreviewCVProps) => {
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn('-mx-6 px-6 py-4 border-y bg-gradient-to-r', theme === 'dark'
        ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100'
        : 'from-purple-50 to-purple-100/50 border-purple-100'
      )}>
        <div className="flex items-center gap-2">
          <ClipboardList className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
          <h2 className="text-xl font-semibold">Detalles Asociados</h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Card className={cn("overflow-hidden", theme === 'dark' ? 'bg-zinc-800/50' : 'bg-white/50')}>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-2">
              {[
                { icon: <Calendar className="w-4 h-4" />, label: "Fecha de compra", value: cv?.datePurchase && new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.datePurchase)) },
                { icon: <PenTool className="w-4 h-4" />, label: "Fecha de instalación", value: cv?.dateInstallation && new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.dateInstallation)) },
                { icon: <Play className="w-4 h-4" />, label: "Inicio de operación", value: cv?.dateOperation && new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.dateOperation)) },
                { icon: <ShoppingCart className="w-4 h-4" />, label: "Tipo de adquisición", value: cv?.acquisition },
                { icon: <Shield className="w-4 h-4" />, label: "Garantía", value: cv?.warranty },
                { icon: <DollarSign className="w-4 h-4" />, label: "Valor", value: cv?.price },
              ].map((item, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => copyToClipboard(item.value || '')}
                        className={cn("p-3 rounded-lg border transition-all cursor-pointer group", theme === 'dark' ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700' : 'border-purple-100 bg-white hover:bg-purple-50')}
                      >
                        <div className={cn("flex items-center gap-2 mb-1", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')}>
                          {item.icon}
                          <span className="text-xs font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{item.value || 'No disponible'}</p>
                          <Copy className="w-3 h-3 md:w-4 md:h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click para copiar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-3">
          {[{
            title: "Fabricante",
            icon: <Factory className="w-5 h-5" />,
            data: cv?.manufacturer,
            fields: [
              { key: 'name' as const, label: 'Nombre' },
              { key: 'phone' as const, label: 'Teléfono' },
              { key: 'country' as const, label: 'País' }
            ]
          }, {
            title: "Proveedor",
            icon: <Truck className="w-5 h-5" />,
            data: cv?.supplier,
            fields: [
              { key: 'name' as const, label: 'Nombre' },
              { key: 'phone' as const, label: 'Teléfono' },
              { key: 'city' as const, label: 'Ciudad' }
            ]
          }, {
            title: "Representante",
            icon: <UserCheck className="w-5 h-5" />,
            data: cv?.representative,
            fields: [
              { key: 'name' as const, label: 'Nombre' },
              { key: 'phone' as const, label: 'Teléfono' },
              { key: 'city' as const, label: 'Ciudad' }
            ]
          }].map((stakeholder, index) => (
            <Card key={index} className={cn("hover:shadow-md transition-shadow", theme === 'dark' ? 'bg-zinc-800/50' : 'bg-white/50')}>
              <CardHeader className="p-4 pb-2">
                <CardTitle className={cn("text-lg flex items-center gap-2", theme === 'dark' ? 'text-purple-300' : 'text-purple-700')}>
                  <span className={theme === 'dark' ? 'text-purple-300' : ''}>
                    {stakeholder.icon}
                  </span>
                  {stakeholder.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 py-0">
                <div className="space-y-2">
                  {stakeholder.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{field.label}:</span>
                      <Badge variant="outline" className={cn("font-normal", theme === 'dark' ? 'border-zinc-700 bg-zinc-800/80' : '')}>
                        {stakeholder.data?.[field.key] || 'N/A'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <Link className="w-full" to={`https://wa.me/${stakeholder.data?.phone}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className={cn("w-full justify-center", theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-700/50' : '')}>
                    <Mail className={cn("w-4 h-4 mr-2", theme === 'dark' ? 'text-purple-300' : '')} />
                    Contactar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DetailsPreviewCV