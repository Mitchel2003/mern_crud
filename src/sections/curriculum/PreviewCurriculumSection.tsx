import { Curriculum, Inspection, Accessory, ThemeContextProps } from "@/interfaces/context.interface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/ui/table"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Card, CardContent, CardHeader } from "#/ui/card"
import { Metadata } from "@/interfaces/db.interface"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Badge } from "#/ui/badge"
import { cn } from "@/lib/utils"
import DashboardSkeleton from "@/components/common/skeletons/DashboardSkeleton"

interface PreviewCurriculumSectionProps extends ThemeContextProps { id: string }

const PreviewCurriculumSection = ({ theme, id }: PreviewCurriculumSectionProps) => {
  const { fetchFormatById, fetchAllFiles, fetchFormatByQuery } = useQueryFormat()
  const { data: files } = fetchAllFiles<Metadata>('file', { id, ref: 'preview' })

  const { data: cv, isLoading: isLoadingCv } = fetchFormatById<Curriculum>('cv', id)
  const { data: acc, isLoading: isLoadingAcc } = fetchFormatByQuery<Accessory>('accessory', { curriculum: id })
  const { data: ins, isLoading: isLoadingIns } = fetchFormatById<Inspection>('inspection', cv?.inspection._id as string)

  if (isLoadingCv || isLoadingIns || isLoadingAcc) return <DashboardSkeleton theme={theme} />
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="max-w-5xl mx-auto border-purple-100">
        <CardHeader className="space-y-2 border-b bg-purple-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-purple-950">Hoja de vida de Equipo</h1>
              <p className={cn('text-sm', theme === 'dark' ? ' text-purple-600' : 'text-purple-700')}>
                Código: FHV-01 | Versión: 02 | Vigente desde: 01-08-2019
              </p>
            </div>
            {files && (
              <div className="relative w-32 h-32">
                <img
                  className="object-contain rounded-lg border border-purple-100"
                  src={files[0]?.url || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
                  alt="Equipment"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {/* Location Information */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Cliente</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Badge variant="outline">{cv.office.area.headquarter.client.name}</Badge>
                <Badge variant="outline">{cv.office.area.headquarter.name}</Badge>
                <Badge variant="outline">{cv.office.area.name}</Badge>
                <Badge variant="outline">{cv.office.name}</Badge>
                <Badge variant="outline">{cv.service}</Badge>
              </div>
            </section>
          )}

          <Separator />

          {/* General Information */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Información General</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm text-muted-foreground">{cv.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Marca</p>
                  <p className="text-sm text-muted-foreground">{cv.brand}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Modelo</p>
                  <p className="text-sm text-muted-foreground">{cv.modelEquip}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Serie</p>
                  <p className="text-sm text-muted-foreground">{cv.serie}</p>
                </div>
              </div>
            </section>
          )}

          <Separator />

          {/* Associated Details */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Detalles Asociados</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fecha de compra</p>
                  <p className="text-sm text-muted-foreground">{cv.datePurchase || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fecha de instalación</p>
                  <p className="text-sm text-muted-foreground">{cv.dateInstallation || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Inicio de operación</p>
                  <p className="text-sm text-muted-foreground">{cv.dateOperation || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo de adquisición</p>
                  <p className="text-sm text-muted-foreground">{cv.acquisition || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Garantía</p>
                  <p className="text-sm text-muted-foreground">{cv.warranty || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor</p>
                  <p className="text-sm text-muted-foreground">{cv.price || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fabricante</p>
                  <p className="text-sm text-muted-foreground">{cv?.manufacturer?.name || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Proveedor</p>
                  <p className="text-sm text-muted-foreground">{cv?.supplier?.name || 'No disponible'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Representante</p>
                  <p className="text-sm text-muted-foreground">{cv?.representative?.name || 'No disponible'}</p>
                </div>
              </div>
            </section>
          )}

          <Separator />

          {/* Classification */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Clasificación</h2>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tipo</p>
                    <p className="text-sm text-muted-foreground">{cv.typeClassification}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Clasificación por uso</p>
                    <p className="text-sm text-muted-foreground">{cv.useClassification}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Clasificación biomédica</p>
                    <p className="text-sm text-muted-foreground">{cv.biomedicalClassification}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Clasificación de riesgo</p>
                    <p className="text-sm text-muted-foreground">{cv.riskClassification}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Fuentes de alimentación</p>
                    <div className="flex flex-wrap gap-2">
                      {cv.powerSupply.map((source) => (
                        <Badge key={source} variant="secondary">{source}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tecnología predominante</p>
                    <div className="flex flex-wrap gap-2">
                      {cv.technologyPredominant.map((tech) => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <Separator />

          {/* Maintenance */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Mantenimiento</h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo de mantenimiento</p>
                  <div className="flex flex-wrap gap-2">
                    {cv.typeMaintenance.map((type) => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Frecuencia</p>
                  <p className="text-sm text-muted-foreground">{cv.frequencyMaintenance}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Manual disponible</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{cv.manualsMaintenance}</Badge>
                  </div>
                </div>
              </div>
            </section>
          )}

          <Separator />

          {/* Technical Specifications */}
          {cv && (
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
                    <TableCell>{cv.technicalCharacteristics.voltage || '--'}</TableCell>
                    <TableCell className="font-medium">Corriente</TableCell>
                    <TableCell>{cv.technicalCharacteristics.amperage || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Potencia</TableCell>
                    <TableCell>{cv.technicalCharacteristics.power || '--'}</TableCell>
                    <TableCell className="font-medium">Frecuencia</TableCell>
                    <TableCell>{cv.technicalCharacteristics.frequency || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Presión</TableCell>
                    <TableCell>{cv.technicalCharacteristics.pressure || '--'}</TableCell>
                    <TableCell className="font-medium">Velocidad</TableCell>
                    <TableCell>{cv.technicalCharacteristics.speed || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Humedad</TableCell>
                    <TableCell>{cv.technicalCharacteristics.humidity || '--'}</TableCell>
                    <TableCell className="font-medium">Temperatura</TableCell>
                    <TableCell>{cv.technicalCharacteristics.temperature || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Peso</TableCell>
                    <TableCell>{cv.technicalCharacteristics.weight || '--'}</TableCell>
                    <TableCell className="font-medium"></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
          )}

          <Separator className="bg-purple-100" />

          {/* Inspection Configuration */}
          {ins && (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Configuración de Inspección</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Nombre de la configuración</p>
                    <p className="text-sm text-muted-foreground">{ins.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lista de inspecciones</p>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {ins.typeInspection.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="w-full">
                              {item}
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

          {/* Accessories */}
          {acc && acc.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-xl font-semibold mb-4">Accesorios</h2>
                <div className="grid gap-4">
                  {acc.map((accessory, index) => (
                    <Badge key={accessory._id} variant="outline">
                      {index + 1}. {accessory.name}
                    </Badge>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator />

          {/* Characteristics */}
          {cv && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Características</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Características del equipo</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {cv.characteristics}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recomendaciones del fabricante</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {cv.recommendationsManufacturer}
                  </p>
                </div>
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PreviewCurriculumSection