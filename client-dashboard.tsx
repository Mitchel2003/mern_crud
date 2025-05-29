import { useState } from "react"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Monitor,
  FileText,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Component() {
  const [expandedSedes, setExpandedSedes] = useState<string[]>([])
  const [expandedConsultorios, setExpandedConsultorios] = useState<string[]>([])
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null)
  const [isHojaVidaOpen, setIsHojaVidaOpen] = useState(false)

  const toggleSede = (sedeId: string) => {
    setExpandedSedes((prev) => (prev.includes(sedeId) ? prev.filter((id) => id !== sedeId) : [...prev, sedeId]))
  }

  const toggleConsultorio = (consultorioId: string) => {
    setExpandedConsultorios((prev) =>
      prev.includes(consultorioId) ? prev.filter((id) => id !== consultorioId) : [...prev, consultorioId],
    )
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800"
      case "Inactivo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openHojaVida = (equipo: any) => { setSelectedEquipo(equipo); setIsHojaVidaOpen(true) }
  const totalEquipos = clientData.sedes.reduce((total, sede) => total + sede.consultorios.reduce((sedeTotal, consultorio) => sedeTotal + consultorio.equipos.length, 0), 0)
  const totalConsultorios = clientData.sedes.reduce((total, sede) => total + sede.consultorios.length, 0)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header del Cliente */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={clientData.logo || "/placeholder.svg"}
                  alt={`Logo de ${clientData.nombre}`}
                  width={80}
                  height={80}
                  className="rounded-lg border"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{clientData.nombre}</CardTitle>
                  <Badge variant="outline">ID: {clientData.id}</Badge>
                </div>
                <CardDescription className="text-base mb-4">Cliente de Mantenimiento Biomédico</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">NIT: {clientData.nit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{clientData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{clientData.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Desde: {clientData.fechaRegistro}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{clientData.sedes.length}</p>
                  <p className="text-sm text-muted-foreground">Sedes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{totalConsultorios}</p>
                  <p className="text-sm text-muted-foreground">Consultorios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{totalEquipos}</p>
                  <p className="text-sm text-muted-foreground">Equipos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <Tabs defaultValue="sedes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sedes">Sedes y Consultorios</TabsTrigger>
            <TabsTrigger value="equipos">Equipos por Sede</TabsTrigger>
            <TabsTrigger value="resumen">Resumen General</TabsTrigger>
          </TabsList>

          <TabsContent value="sedes" className="space-y-4">
            {clientData.sedes.map((sede) => (
              <Card key={sede.id}>
                <Collapsible open={expandedSedes.includes(sede.id)} onOpenChange={() => toggleSede(sede.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
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
                        {sede.consultorios.map((consultorio) => (
                          <Card key={consultorio.id} className="border-l-4 border-l-blue-500">
                            <Collapsible
                              open={expandedConsultorios.includes(consultorio.id)}
                              onOpenChange={() => toggleConsultorio(consultorio.id)}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
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
                                    {consultorio.equipos.map((equipo) => (
                                      <div
                                        key={equipo.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Monitor className="h-4 w-4 text-purple-600" />
                                          <div>
                                            <p className="font-medium text-sm">{equipo.nombre}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {equipo.modelo} • Serie: {equipo.serie}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Responsable: {equipo.responsable}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="text-right">
                                            <Badge className={getEstadoBadgeColor(equipo.estado)}>
                                              {equipo.estado}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Últ. mant: {equipo.ultimoMantenimiento}
                                            </p>
                                          </div>
                                          <Button variant="outline" size="sm" onClick={() => openHojaVida(equipo)}>
                                            <FileText className="h-3 w-3 mr-1" />
                                            Hoja de Vida
                                          </Button>
                                        </div>
                                      </div>
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

          <TabsContent value="equipos" className="space-y-4">
            <div className="grid gap-4">
              {clientData.sedes.map((sede) => (
                <Card key={sede.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {sede.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {sede.consultorios.map((consultorio) => (
                        <div key={consultorio.id}>
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                            {consultorio.nombre}
                            <span className="text-xs text-muted-foreground ml-2">• {consultorio.servicio}</span>
                          </h4>
                          <div className="grid gap-2 ml-6">
                            {consultorio.equipos.map((equipo) => (
                              <div key={equipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Monitor className="h-4 w-4 text-purple-600" />
                                  <div>
                                    <p className="font-medium text-sm">{equipo.nombre}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {equipo.modelo} • {equipo.serie}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getEstadoBadgeColor(equipo.estado)}>{equipo.estado}</Badge>
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Hoja de Vida
                                  </Button>
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

          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen por Sede</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientData.sedes.map((sede) => {
                      const equiposPorSede = sede.consultorios.reduce(
                        (total, consultorio) => total + consultorio.equipos.length,
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
                    {["Activo", "Mantenimiento", "Inactivo"].map((estado) => {
                      const count = clientData.sedes.reduce(
                        (total, sede) =>
                          total +
                          sede.consultorios.reduce(
                            (sedeTotal, consultorio) =>
                              sedeTotal + consultorio.equipos.filter((equipo) => equipo.estado === estado).length,
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
      </div>
      {/* Dialog para Hoja de Vida */}
      <Dialog open={isHojaVidaOpen} onOpenChange={setIsHojaVidaOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEquipo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  Hoja de Vida - {selectedEquipo.nombre}
                </DialogTitle>
                <DialogDescription>Información completa del equipo y historial de mantenimientos</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Información General */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre del Equipo</label>
                          <p className="text-sm">{selectedEquipo.nombre}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                          <p className="text-sm">{selectedEquipo.modelo}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Número de Serie</label>
                          <p className="text-sm">{selectedEquipo.serie}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fabricante</label>
                          <p className="text-sm">{selectedEquipo.fabricante}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Estado Actual</label>
                          <div className="mt-1">
                            <Badge className={getEstadoBadgeColor(selectedEquipo.estado)}>
                              {selectedEquipo.estado}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fecha de Adquisición</label>
                          <p className="text-sm">{selectedEquipo.fechaAdquisicion}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Garantía hasta</label>
                          <p className="text-sm">{selectedEquipo.garantia}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Ubicación Específica</label>
                          <p className="text-sm">{selectedEquipo.ubicacionEspecifica}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estado y Responsable */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estado Actual y Responsabilidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Responsable del Equipo</label>
                        <p className="text-sm">{selectedEquipo.responsable}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Último Mantenimiento</label>
                        <p className="text-sm">{selectedEquipo.ultimoMantenimiento}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Observaciones Actuales</label>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedEquipo.observacionesActuales}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Historial de Mantenimientos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historial de Mantenimientos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEquipo.historialMantenimientos.map((mantenimiento: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={mantenimiento.tipo === "Preventivo" ? "default" : "destructive"}>
                                {mantenimiento.tipo}
                              </Badge>
                              <span className="text-sm font-medium">{mantenimiento.fecha}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Técnico: {mantenimiento.tecnico}</span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Observaciones</label>
                              <p className="text-sm bg-gray-50 p-2 rounded">{mantenimiento.observaciones}</p>
                            </div>
                            {mantenimiento.proximoMantenimiento && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Próximo Mantenimiento
                                </label>
                                <p className="text-sm">{mantenimiento.proximoMantenimiento}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
