import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/ui/table"
import { Curriculum, Inspection, Accessory } from "@/interfaces/context.interface"
import { Card, CardContent, CardHeader } from "#/ui/card"
import { Metadata } from "@/interfaces/db.interface"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Badge } from "#/ui/badge"

interface PreviewCurriculumSectionProps {
  accessories?: Accessory[]
  inspection?: Inspection
  curriculum?: Curriculum
  files?: Metadata[]
}

const PreviewCurriculumSection = ({ curriculum, inspection, accessories, files }: PreviewCurriculumSectionProps) => {
  if (!curriculum) return null

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="max-w-5xl mx-auto border-purple-100">
        <CardHeader className="space-y-2 border-b bg-purple-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-purple-950">Hoja de vida de Equipo</h1>
              <p className="text-sm text-purple-600">
                Código: FHV-01 | Versión: 02 | Vigente desde: 01-08-2019
              </p>
            </div>
            {files && (
              <div className="relative w-32 h-32">
                <img
                  className="object-contain rounded-lg border border-purple-100"
                  src={files[0].url || "/placeholder.svg"}
                  alt="Equipment"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {/* Location Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Cliente</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Badge variant="outline">{curriculum.office.area.headquarter.client.name}</Badge>
              <Badge variant="outline">{curriculum.office.area.headquarter.name}</Badge>
              <Badge variant="outline">{curriculum.office.area.name}</Badge>
              <Badge variant="outline">{curriculum.office.name}</Badge>
              <Badge variant="outline">{curriculum.service}</Badge>
            </div>
          </section>

          <Separator />

          {/* General Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Información General</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Nombre</p>
                <p className="text-sm text-muted-foreground">{curriculum.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Marca</p>
                <p className="text-sm text-muted-foreground">{curriculum.brand}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Modelo</p>
                <p className="text-sm text-muted-foreground">{curriculum.modelEquip}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Serie</p>
                <p className="text-sm text-muted-foreground">{curriculum.serie}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Classification */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Clasificación</h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo</p>
                  <p className="text-sm text-muted-foreground">{curriculum.typeClassification}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Clasificación por uso</p>
                  <p className="text-sm text-muted-foreground">{curriculum.useClassification}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Clasificación biomédica</p>
                  <p className="text-sm text-muted-foreground">{curriculum.biomedicalClassification}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Clasificación de riesgo</p>
                  <p className="text-sm text-muted-foreground">{curriculum.riskClassification}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fuentes de alimentación</p>
                  <div className="flex flex-wrap gap-2">
                    {curriculum.powerSupply.map((source) => (
                      <Badge key={source} variant="secondary">{source}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tecnología predominante</p>
                  <div className="flex flex-wrap gap-2">
                    {curriculum.technologyPredominant.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Technical Specifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Especificaciones Técnicas</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parámetro</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Parámetro</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Voltaje</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.voltage}</TableCell>
                  <TableCell className="font-medium">Corriente</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.amperage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Potencia</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.power}</TableCell>
                  <TableCell className="font-medium">Frecuencia</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.frequency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Presión</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.pressure}</TableCell>
                  <TableCell className="font-medium">Velocidad</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.speed}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Humedad</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.humidity}</TableCell>
                  <TableCell className="font-medium">Temperatura</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.temperature}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Peso</TableCell>
                  <TableCell>{curriculum.technicalCharacteristics.weight}</TableCell>
                  <TableCell className="font-medium"></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator />

          {/* Characteristics */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Características</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Características del equipo</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {curriculum.characteristics}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Recomendaciones del fabricante</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {curriculum.manufacturerRecommendations}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Maintenance */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Mantenimiento</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Tipo de mantenimiento</p>
                <div className="flex flex-wrap gap-2">
                  {curriculum.typeMaintenance.map((type) => (
                    <Badge key={type} variant="outline">{type}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Frecuencia</p>
                <p className="text-sm text-muted-foreground">{curriculum.frequencyMaintenance}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Manual disponible</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{curriculum.manualsMaintenance}</Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Inspection Section - New */}
          <section className="bg-purple-50/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-950">Inspección</h2>
            <ScrollArea className="h-[200px] w-full rounded-md border border-purple-100 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inspection?.typeInspection.map((type, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="justify-start bg-white hover:bg-purple-50"
                  >
                    {type.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </section>

          <Separator className="bg-purple-100" />

          {/* Accessories Section - New */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-950">Accesorios</h2>
            <div className="grid gap-3">
              {accessories?.map((accessory, index) => (
                <Badge key={index} variant="outline" className="w-full">
                  {index + 1}. {accessory.name}
                </Badge>
              ))}
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* Inspection Configuration */}
          {inspection && (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Configuración de Inspección</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Nombre de la configuración</p>
                    <p className="text-sm text-muted-foreground">{inspection.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lista de inspecciones</p>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {inspection.typeInspection.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="w-full">
                              {item.name}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </section>
              <Separator />
            </>
          )}

          {/* Associated Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Detalles Asociados</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Fecha de compra</p>
                <p className="text-sm text-muted-foreground">{curriculum.datePurchase || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Fecha de instalación</p>
                <p className="text-sm text-muted-foreground">{curriculum.dateInstallation || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Inicio de operación</p>
                <p className="text-sm text-muted-foreground">{curriculum.dateOperation || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Tipo de adquisición</p>
                <p className="text-sm text-muted-foreground">{curriculum.acquisition || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Garantía</p>
                <p className="text-sm text-muted-foreground">{curriculum.warranty || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Valor</p>
                <p className="text-sm text-muted-foreground">{curriculum.price || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Fabricante</p>
                <p className="text-sm text-muted-foreground">{curriculum?.manufacturer?.name || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Proveedor</p>
                <p className="text-sm text-muted-foreground">{curriculum?.supplier?.name || 'No disponible'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Representante</p>
                <p className="text-sm text-muted-foreground">{curriculum?.representative?.name || 'No disponible'}</p>
              </div>
            </div>
          </section>

          {/* Accessories */}
          {accessories && accessories.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-xl font-semibold mb-4">Accesorios</h2>
                <div className="grid gap-4">
                  {accessories.map((accessory, index) => (
                    <Badge key={accessory._id} variant="outline">
                      {index + 1}. {accessory.name}
                    </Badge>
                  ))}
                </div>
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PreviewCurriculumSection