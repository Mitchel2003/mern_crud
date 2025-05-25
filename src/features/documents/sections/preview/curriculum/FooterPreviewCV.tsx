import { Building, Building2, Copy, FileCheck, FileText, ListChecks, Mail, PenTool } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { resolveProviderHierarchy } from "@/utils/helpers"
import { Card, CardContent } from "#/ui/card"
import { copyToClipboard } from "@/lib/utils"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Link } from "react-router-dom"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { Label } from "#/ui/label"
import { cn } from "@/lib/utils"

export interface FooterPreviewCVProps extends ThemeContextProps { cv: Curriculum }
const FooterPreviewCV = ({ cv, theme }: FooterPreviewCVProps) => {
  const provider = resolveProviderHierarchy(cv.createdBy)
  return (
    <>
      <section className="animate-in fade-in-50 duration-500">
        <div className={cn("bg-gradient-to-r -mx-6 px-6 py-4 border-y", theme === 'dark' ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100' : 'from-purple-50 to-purple-100/50 border-purple-100')}>
          <div className="flex items-center gap-2">
            <FileText className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
            <h2 className="text-xl font-semibold">Características</h2>
          </div>
        </div>

        <div className="mt-6">
          <Card className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white/50')}>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Características del equipo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')}>
                      <PenTool className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    </div>
                    <h3 className="font-medium">Características del equipo</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-200 to-transparent rounded-full" />
                    <div className="pl-4">
                      <ScrollArea className="min-h-[100px] pr-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {cv?.characteristics || 'No se han registrado características'}
                        </p>
                      </ScrollArea>
                    </div>
                  </div>
                </div>

                {/* Recomendaciones del fabricante */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')}>
                      <ListChecks className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    </div>
                    <h3 className="font-medium">Recomendaciones del fabricante</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-200 to-transparent rounded-full" />
                    <div className="pl-4">
                      <ScrollArea className="min-h-[100px] pr-4">
                        {cv?.recommendationsManufacturer ? (
                          <div className="space-y-2">
                            {cv.recommendationsManufacturer.split('\n').map((rec, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Badge variant="outline" className="mt-1 shrink-0">
                                  {index + 1}
                                </Badge>
                                <p className="text-sm text-muted-foreground">{rec}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No se han registrado recomendaciones
                          </p>
                        )}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Proveedor del servicio */}
      <section className="animate-in fade-in-50 duration-500">
        <div className={cn("bg-gradient-to-r -mx-6 px-6 py-4 border-y", theme === 'dark' ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100' : 'from-purple-50 to-purple-100/50 border-purple-100')}>
          <div className="flex items-center gap-2">
            <Building2 className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
            <h2 className="text-xl font-semibold">Proveedor del servicio</h2>
          </div>
        </div>

        <div className="mt-6">

          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo del proveedor */}
            <div className="relative group">
              <div className={cn("w-32 h-32 rounded-lg border overflow-hidden", theme === 'dark' ? 'border-zinc-700 bg-zinc-800' : 'border-purple-100 bg-white')}>
                <img
                  alt="Logo proveedor"
                  src={provider?.metadata?.logo || '/placeholder.svg?height=128&width=128'}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>

            {/* Información del proveedor */}
            <div className="flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    <h3 className="font-medium">Información General</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Nombre del proveedor</Label>
                      <p className="font-medium">{provider?.username || 'No especificado'}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">NIT</Label>
                      <p className="font-medium">{provider?.nit || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    <h3 className="font-medium">Certificaciones</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Invima</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {provider?.invima || 'No especificado'}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(provider?.invima || '')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copiar Invima</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Licencia profesional</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {provider?.profesionalLicense || 'No especificado'}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(provider?.profesionalLicense || '')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copiar licencia profesional</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')} />

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Link to='https://wa.me/573178631535?text=Hola, quisiera saber más sobre tus servicios' target='_blank' rel='noopener noreferrer'>
                  <Button variant="outline" className={cn("gap-2", theme === 'dark' ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700' : '')}>
                    <Mail className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : '')} />
                    Contactar
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-50')}>
                    Proveedor Verificado
                  </Badge>
                  <Badge variant="outline" className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-50')}>
                    Servicio Activo
                  </Badge>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section >
    </>
  )
}

export default FooterPreviewCV