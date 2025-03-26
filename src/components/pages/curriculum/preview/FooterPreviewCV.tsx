import { Building, Building2, Copy, FileCheck, FileText, ListChecks, Mail, PenTool } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { User, Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { Card, CardContent } from "#/ui/card"
import { copyToClipboard } from "@/lib/utils"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Link } from "react-router-dom"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { Label } from "#/ui/label"

interface FooterPreviewCVProps extends ThemeContextProps {
  imgCom: string
  cv: Curriculum
  com?: User
}

const FooterPreviewCV = ({ cv, com, imgCom }: FooterPreviewCVProps) => {
  return (
    <>
      <section className="animate-in fade-in-50 duration-500">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Características</h2>
          </div>
        </div>

        <div className="mt-6">
          <Card className="bg-white/50">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Características del equipo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PenTool className="w-4 h-4 text-purple-600" />
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
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ListChecks className="w-4 h-4 text-purple-600" />
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
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Proveedor del servicio</h2>
          </div>
        </div>

        <div className="mt-6">

          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo del proveedor */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-lg border border-purple-100 overflow-hidden bg-white">
                <img
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  src={imgCom || '/placeholder.svg?height=128&width=128'}
                  alt="Logo proveedor"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>

            {/* Información del proveedor */}
            <div className="flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <h3 className="font-medium">Información General</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Nombre del proveedor</Label>
                      <p className="font-medium">{com?.username || 'No especificado'}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">NIT</Label>
                      <p className="font-medium">{com?.nit || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-purple-600" />
                    <h3 className="font-medium">Certificaciones</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Invima</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {com?.invima || 'No especificado'}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(com?.invima || '')}
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
                          {com?.profesionalLicense || 'No especificado'}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(com?.profesionalLicense || '')}
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

              <Separator className="bg-purple-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-50">
                    Proveedor Verificado
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50">
                    Servicio Activo
                  </Badge>
                </div>
                <Link to='https://wa.me/573178631535?text=Hola, quisiera saber más sobre tus servicios biomedicos' target='_blank' rel='noopener noreferrer'>
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Contactar
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section >
    </>
  )
}

export default FooterPreviewCV