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

interface EquipmentPreviewCVProps extends ThemeContextProps {
  accs?: Accessory[]
  cv: Curriculum
  imgCv: string
}
const EquipmentPreviewCV = ({ cv, accs, imgCv, theme }: EquipmentPreviewCVProps) => {
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn(
        '-mx-6 px-6 py-4 border-y bg-gradient-to-r',
        theme === 'dark'
          ? 'from-purple-50 to-purple-100/50  border-purple-100'
          : 'from-purple-50 to-purple-100/50  border-purple-100'
      )}>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Información General</h2>
        </div>
      </div>

      {/** Información General */}
      <Card className="mt-6 bg-white/50 overflow-hidden">
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
                        <div
                          className="flex items-center gap-4 px-4 py-2 rounded-lg border border-purple-100 bg-white hover:bg-purple-50 transition-all cursor-pointer group"
                          onClick={() => copyToClipboard(item.value || '')}
                        >
                          <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-medium">{item.value || 'No disponible'}</p>
                          </div>
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click para copiar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <Separator className="my-4 bg-purple-100" />

              {/* Clasificación biomédica */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Estado", value: "Activo" },
                  { label: "Riesgo", value: cv?.riskClassification },
                  { label: "Clasificación", value: cv?.useClassification },
                  { label: "Tipo", value: cv?.typeClassification }
                ].map((item, index) => (
                  <Badge key={index} variant="outline" className="justify-start gap-2 py-1.5 px-3">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span>{item.value}</span>
                  </Badge>
                ))}
              </div>

              <Separator className="my-4 bg-purple-100" />

              {/* Fuentes de Alimentación y Tecnologías predominantes */}
              <div className="grid md:grid-cols-2 gap-4 relative">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    Fuentes de Alimentación
                  </h3>
                  <div className="flex flex-wrap gap-2 bg-purple-50/50 p-2 rounded-lg">
                    {cv?.powerSupply.map((source, index) => (
                      <Badge key={index} variant={"secondary"} className="bg-purple-100 hover:bg-purple-200 transition-colors">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="absolute hidden md:block top-0 bottom-0 left-1/2 -translate-x-1/2">
                  <Separator orientation="vertical" className="h-full bg-purple-100" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    Tecnología Predominante
                  </h3>
                  <div className="flex flex-wrap gap-2 bg-purple-50/50 p-2 rounded-lg">
                    {cv?.technologyPredominant.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 hover:bg-purple-200 transition-colors">
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
                  src={imgCv || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
                  alt="Equipo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20" onClick={() => window.open(imgCv, '_blank')}>
                    <Search className="w-4 h-4 mr-2" />
                    Ver imagen completa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesorios */}
      <Card className="mt-6 bg-white/50">
        <CardHeader className="border-b border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-purple-600" />
              <CardTitle>Accesorios del Equipo</CardTitle>
            </div>
            <Badge variant="outline" className="bg-purple-50">
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

                  <div className="relative z-20 p-4 rounded-lg border border-purple-100 bg-white hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-medium truncate">{acc.name}</h4>
                        <Badge variant="secondary" className="bg-purple-50">
                          {acc.type}
                        </Badge>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
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

                    <Separator className="my-3" />

                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span className="text-muted-foreground">Modelo:</span>
                        <span className="font-medium truncate">{acc.modelEquip}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Barcode className="w-4 h-4 text-purple-600" />
                        <span className="text-muted-foreground">Serie:</span>
                        <span className="font-medium truncate">{acc.serie}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => copyToClipboard(acc.serie)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
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
                  <PackageX className="w-12 h-12 text-muted-foreground mb-4" />
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
    </section>
  )
}

export default EquipmentPreviewCV