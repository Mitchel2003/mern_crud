import { Barcode, Bookmark, Copy, Cpu, FileText, Info, Layers, PackageX, Puzzle, Search, Tag, Zap } from "lucide-react"
import { Accessory, Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#/ui/hover-card"
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card"
import { cn, copyToClipboard } from "@/lib/utils"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

export interface EquipmentPreviewCVProps extends ThemeContextProps {
  accs?: Accessory[]
  cv: Curriculum
  auth?: boolean
}

const EquipmentPreviewCV = ({ cv, accs, auth, theme }: EquipmentPreviewCVProps) => {
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn('-mx-6 px-6 py-4 border-y bg-gradient-to-r', theme === 'dark'
        ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100'
        : 'from-purple-50 to-purple-100/50 border-purple-100'
      )}>
        <div className="flex items-center gap-2">
          <FileText className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
          <h2 className="text-xl font-semibold">Información General</h2>
        </div>
      </div>

      {/** Información General */}
      <Card className={cn("mt-6 overflow-hidden", theme === 'dark' ? 'bg-zinc-800/50' : 'bg-white/50')}>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Columna izquierda - Información principal */}
            <div className="md:col-span-2 p-6">
              {/** Datos básicos */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: <Tag className="w-4 h-4" />, label: "Nombre", value: cv?.name },
                  { icon: <Bookmark className="w-4 h-4" />, label: "Marca", value: cv?.brand },
                  { icon: <Layers className="w-4 h-4" />, label: "Modelo", value: cv?.modelEquip },
                  { icon: <Barcode className="w-4 h-4" />, label: "Serie", value: cv?.serie }
                ].map((item, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div onClick={() => copyToClipboard(item.value || '')}
                          className={cn("flex items-center gap-4 px-4 py-2 rounded-lg border transition-all cursor-pointer group",
                            theme === 'dark' ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700' : 'border-purple-100 bg-white hover:bg-purple-50'
                          )}
                        >
                          <div className={cn("p-2 rounded-full",
                            theme === 'dark' ? 'bg-zinc-700 text-purple-300' : 'bg-purple-100 text-purple-600'
                          )}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-medium">{item.value || 'No disponible'}</p>
                          </div>
                          <Copy className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click para copiar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <Separator className={cn("my-4", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')} />

              {/* Clasificación biomédica */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Clasificación uso", value: cv?.useClassification },
                  { label: "Tipo", value: cv?.typeClassification },
                  { label: "Clasificación biomédica", value: cv?.biomedicalClassification },
                  { label: "Riesgo", value: cv?.riskClassification },
                ].map((item, index) => (
                  <Badge key={index} variant="outline" className={cn("justify-start gap-2 py-1.5 px-3", theme === 'dark' ? 'border-zinc-700 bg-zinc-800/80' : '')}>
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span>{item.value}</span>
                  </Badge>
                ))}
              </div>

              <Separator className={cn("my-4", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')} />

              {/* Fuentes de Alimentación y Tecnologías predominantes */}
              <div className="grid md:grid-cols-2 gap-4 relative">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Zap className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    Fuentes de Alimentación
                  </h3>
                  <div className={cn("flex flex-wrap gap-2 p-2 rounded-lg", theme === 'dark' ? 'bg-zinc-800/80' : 'bg-purple-50/50')}>
                    {cv?.powerSupply.map((source, index) => (
                      <Badge key={index} variant={"secondary"} className={cn("transition-colors", theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-purple-100 hover:bg-purple-200')}>
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="absolute hidden md:block top-0 bottom-0 left-1/2 -translate-x-1/2">
                  <Separator orientation="vertical" className={cn("h-full", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Cpu className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    Tecnología Predominante
                  </h3>
                  <div className={cn("flex flex-wrap gap-2 p-2 rounded-lg", theme === 'dark' ? 'bg-zinc-800/80' : 'bg-purple-50/50')}>
                    {cv?.technologyPredominant.map((tech, index) => (
                      <Badge key={index} variant="secondary" className={cn("transition-colors", theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-purple-100 hover:bg-purple-200')}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="relative group">
              <div className="h-full aspect-square">
                <img
                  className="w-full h-full object-cover"
                  src={cv.photoUrl || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
                  alt="Equipo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button variant="outline" className={cn("w-full backdrop-blur-sm", theme === 'dark' ? 'bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700' : 'bg-white/10 hover:bg-white/20')} onClick={() => window.open(cv.photoUrl, '_blank')}>
                    <Search className={cn("w-4 h-4 mr-2", theme === 'dark' ? 'text-purple-300' : '')} />
                    Ver imagen completa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesorios */}
      {auth && (
        <Card className={cn("mt-6", theme === 'dark' ? 'bg-zinc-800/50' : 'bg-white/50')}>
          <CardHeader className={cn("border-b", theme === 'dark' ? 'border-zinc-700' : 'border-purple-100')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-purple-600" />
                <CardTitle>Accesorios del Equipo</CardTitle>
              </div>
              <Badge variant="success" className={cn("", theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-800')}>
                {accs?.length || 0} accesorios
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[400px] w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {accs?.map((acc, index) => (
                  <div
                    key={acc._id}
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute -right-16 -top-16 z-10">
                      <div className="w-32 h-32 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className={cn("relative z-20 p-4 rounded-lg border transition-all duration-300", theme === 'dark' ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700/80' : 'border-purple-100 bg-white hover:shadow-lg')}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h4 className="font-medium truncate">{acc.name}</h4>
                          <Badge variant="secondary" className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-50')}>
                            {acc.type}
                          </Badge>
                        </div>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("h-8 w-8", theme === 'dark' ? 'hover:bg-zinc-700' : '')}>
                              <Info className={cn("h-4 w-4", theme === 'dark' ? 'text-purple-300' : '')} />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className={cn("w-64", theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : '')}>
                            <div className="space-y-2">
                              <h4 className="font-medium">Detalles del Accesorio</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="text-muted-foreground">ID:</span> {acc._id}</p>
                                <p><span className="text-muted-foreground">Estado:</span> Activo</p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      <Separator className={cn("my-3", theme === 'dark' ? 'bg-zinc-700' : '')} />

                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Layers className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                          <span className="text-muted-foreground">Modelo:</span>
                          <span className="font-medium truncate">{acc.modelEquip}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Barcode className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                          <span className="text-muted-foreground">Serie:</span>
                          <span className="font-medium truncate">{acc.serie}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn("w-full", theme === 'dark' ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700' : '')}
                          onClick={() => copyToClipboard(acc.serie)}
                        >
                          <Copy className={cn("w-3 h-3 mr-2", theme === 'dark' ? 'text-purple-300' : '')} />
                          Copiar Serie
                        </Button>
                      </div>

                      <div className="absolute top-1 right-2">
                        <span className="text-sm text-muted-foreground">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!accs || accs.length === 0) && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <PackageX className={cn("w-12 h-12 mb-4", theme === 'dark' ? 'text-zinc-500' : 'text-muted-foreground')} />
                    <h3 className="font-medium text-lg mb-2">Sin accesorios registrados</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Este equipo no tiene accesorios registrados en el sistema.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default EquipmentPreviewCV