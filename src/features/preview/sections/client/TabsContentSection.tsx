import { Building2, Stethoscope, Monitor, MapPin, Phone, FileText, ChevronDown, ChevronRight, Folder } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/ui/tabs"
import { Curriculum } from "@/interfaces/context.interface"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"
import { useState } from "react"

interface TabsContentSectionProps {
  getEstadoBadgeColor: (estado: string) => string
  onNavigateToMaintenance: (equipo: any) => void
  onNavigateToCurriculum: (equipo: any) => void
  onOpenCurriculum: (equipo: any) => void
  clientData: any
}

/** Section of tabs that contains the main content */
export const TabsContentSection = ({ clientData, getEstadoBadgeColor, onOpenCurriculum, onNavigateToMaintenance, onNavigateToCurriculum }: TabsContentSectionProps) => {
  const [expandedConsultorios, setExpandedConsultorios] = useState<string[]>([])
  const [expandedSedes, setExpandedSedes] = useState<string[]>([])
  if (!clientData) return null

  const toggleSede = (sedeId: string) => {
    setExpandedSedes((prev) =>
      prev.includes(sedeId)
        ? prev.filter((id) => id !== sedeId)
        : [...prev, sedeId]
    )
  }

  const toggleConsultorio = (consultorioId: string) => {
    setExpandedConsultorios((prev) =>
      prev.includes(consultorioId)
        ? prev.filter((id) => id !== consultorioId)
        : [...prev, consultorioId]
    )
  }

  return (
    <Tabs defaultValue="sedes" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sedes">Sedes y Consultorios</TabsTrigger>
        <TabsTrigger value="equipos">Equipos por Sede</TabsTrigger>
        <TabsTrigger value="resumen">Resumen General</TabsTrigger>
      </TabsList>

      {/* Tab of Sedes and Offices */}
      <TabsContent value="sedes" className="space-y-4">
        {clientData.sedes.map((sede: any) => (
          <Card key={sede.id}>
            <Collapsible open={expandedSedes.includes(sede.id)} onOpenChange={() => toggleSede(sede.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{sede.nombre}</CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sede.direccion}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {sede.telefono}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{sede.consultorios.length} consultorios</Badge>
                      {expandedSedes.includes(sede.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid gap-4">
                    {sede.consultorios.map((consultorio: any) => (
                      <Card key={consultorio.id} className="border-l-4 border-l-blue-500">
                        <Collapsible
                          open={expandedConsultorios.includes(consultorio.id)}
                          onOpenChange={() => toggleConsultorio(consultorio.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer transition-colors pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Stethoscope className="h-4 w-4 text-green-600" />
                                  <div>
                                    <CardTitle className="text-base">{consultorio.nombre}</CardTitle>
                                    <CardDescription>
                                      Piso {consultorio.piso} • {consultorio.especialidad}
                                      <br />
                                      <span className="text-blue-600 font-medium">
                                        Servicio: {consultorio.servicio}
                                      </span>
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{consultorio.equipos.length} equipos</Badge>
                                  {expandedConsultorios.includes(consultorio.id) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="grid gap-3">
                                {consultorio.equipos.map((equipo: Curriculum & { status: string }) => (
                                  <Card key={equipo._id} className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                      <Monitor className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <p className="font-medium text-sm">{equipo.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {equipo.modelEquip} • Serie: {equipo.serie}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Creado por: {equipo.createdBy.username}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <Badge className={getEstadoBadgeColor(equipo.status)}>
                                          {equipo.status}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-col space-y-2">
                                        <Button variant="outline" size="sm" onClick={() => onOpenCurriculum(equipo)}>
                                          <FileText className="h-3 w-3 mr-1" />
                                          Detalles
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => onNavigateToCurriculum(equipo)}>
                                          <Folder className="h-3 w-3 mr-1" />
                                          Hoja de Vida
                                        </Button>
                                        <Button variant="secondary" size="sm" className="dark:bg-gray-800" onClick={() => onNavigateToMaintenance(equipo)}>
                                          <Stethoscope className="h-3 w-3 mr-1" />
                                          Mantenimiento
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </TabsContent>

      {/* Tab of Equipos por Sede */}
      <TabsContent value="equipos" className="space-y-4">
        <div className="grid gap-4">
          {clientData.sedes.map((sede: any) => (
            <Card key={sede.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {sede.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {sede.consultorios.map((consultorio: any) => (
                    <div key={consultorio.id}>
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-green-600" />
                        {consultorio.nombre}
                        <span className="text-xs text-muted-foreground ml-2">• {consultorio.servicio}</span>
                      </h4>
                      <div className="grid gap-2 ml-6">
                        {consultorio.equipos.map((equipo: Curriculum & { status: string }) => (
                          <div key={equipo._id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Monitor className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="font-medium text-sm">{equipo.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {equipo.modelEquip} • {equipo.serie}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getEstadoBadgeColor(equipo.status)}>{equipo.status}</Badge>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => onOpenCurriculum(equipo)}>
                                  <FileText className="h-3 w-3 mr-1" />
                                  Detalles
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => onNavigateToCurriculum(equipo)}>
                                  <Folder className="h-3 w-3 mr-1" />
                                  Hoja de Vida
                                </Button>
                                <Button variant="secondary" size="sm" className="dark:bg-gray-800" onClick={() => onNavigateToMaintenance(equipo)}>
                                  <Stethoscope className="h-3 w-3 mr-1" />
                                  Mantenimiento
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {consultorio !== sede.consultorios[sede.consultorios.length - 1] && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Tab of General Summary */}
      <TabsContent value="resumen" className="space-y-4">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Sede</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.sedes.map((sede: any) => {
                  const equiposPorSede = sede.consultorios.reduce(
                    (total: number, consultorio: any) => total + consultorio.equipos.length,
                    0,
                  )

                  return (
                    <div key={sede.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{sede.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{sede.direccion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <span className="font-medium">{sede.consultorios.length}</span> consultorios
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{equiposPorSede}</span> equipos
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estados de Equipos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["funcionando", "en espera de repuestos", "fuera de servicio"].map((estado) => {
                  const count = clientData.sedes.reduce(
                    (total: number, sede: any) =>
                      total + sede.consultorios.reduce(
                        (sedeTotal: number, consultorio: any) =>
                          sedeTotal + consultorio.equipos.filter((equipo: Curriculum & { status: string }) => equipo.status === estado).length,
                        0,
                      ),
                    0,
                  )
                  return (
                    <div key={estado} className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{count}</p>
                      <Badge className={getEstadoBadgeColor(estado)}>{estado}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default TabsContentSection