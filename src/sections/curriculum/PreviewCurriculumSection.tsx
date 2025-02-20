import { Copy, FileText, Mail, Phone, Building2, Info, Tag, Bookmark, Layers, Barcode, ClipboardList, Zap, Cpu, Users2, Calendar, PenTool, Play, ShoppingCart, Shield, DollarSign, Factory, Truck, UserCheck, WrenchIcon, InfoIcon, CalendarIcon } from "lucide-react"
import { Curriculum, Inspection, Accessory, ThemeContextProps, Company } from "@/interfaces/context.interface"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useUserQuery"
import { useBase64Image } from "@/hooks/useBase64Img"
import { Metadata } from "@/interfaces/db.interface"
import { Link } from "react-router-dom"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#/ui/hover-card"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/avatar"
import { ScrollArea } from "#/ui/scroll-area"
import { Separator } from "#/ui/separator"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { PDFDownloadLink } from "@react-pdf/renderer"
import "react-circular-progressbar/dist/styles.css"
import { copyToClipboard } from '@/lib/utils'

interface PreviewCurriculumSectionProps extends ThemeContextProps { id: string }

const PreviewCurriculumSection = ({ theme, id }: PreviewCurriculumSectionProps) => {
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: com, isLoading: isLoadingCom } = queryUser.fetchAllUsers<Company>('company')
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id)
  const { data: ins, isLoading: isLoadingIns } = queryFormat.fetchFormatById<Inspection>('inspection', cv?.inspection._id as string)
  const { data: acc, isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const idClient = cv?.office?.headquarter?.client._id
  const idCompany = com?.[0]?._id

  const { data: imgClient, isLoading: isLoadingImgCl } = queryFormat.fetchAllFiles<Metadata>('file', { path: `client/${idClient}/preview`, enabled: !!idClient })
  const { data: imgCom, isLoading: isLoadingImgCom } = queryFormat.fetchAllFiles<Metadata>('file', { path: `company/${idCompany}/preview`, enabled: !!idCompany })
  const { data: imgCv, isLoading: isLoadingImgCv } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${id}/preview`, enabled: !!id })
  const isLoadingData = isLoadingCv || isLoadingIns || isLoadingAcc || isLoadingCom
  const isLoadingFile = isLoadingImgCv || isLoadingImgCl || isLoadingImgCom

  const { dataUrl: clientLogo } = useBase64Image(imgClient?.[0]?.url);
  const { dataUrl: companyLogo } = useBase64Image(imgCom?.[0]?.url);
  console.log({ clientLogo, companyLogo })

  if (isLoadingData || isLoadingFile) return <DashboardSkeleton theme={theme} />
  return (
    <div className="container mx-auto p-6 space-y-8">
      {cv && (
        <PDFDownloadLink
          fileName={`curriculum-${cv._id}.pdf`}
          document={
            <CurriculumPDF
              companyLogo={companyLogo ?? undefined}
              clientLogo={clientLogo ?? undefined}
              accessories={acc}
              inspection={ins}
              cv={cv}
            />
          }
        >
          {({ loading }) => (
            <Button
              variant="default"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      )}
      <Card className="max-w-5xl mx-auto border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader className="space-y-2 rounded-t-xl border-b bg-gradient-to-r from-purple-200 to-purple-100/50 p-6">
          {/*** Header ***/}
          <div className="flex justify-between items-start">
            {imgClient && (
              <div className="relative max-w-64 max-h-40 transition-transform hover:scale-105">
                <img
                  className="object-contain rounded-lg border border-purple-100 shadow-sm"
                  src={imgClient[0]?.url || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
                  alt="Logo Cliente"
                />
              </div>
            )}
            <div className="text-right">
              <h1 className="text-3xl font-bold tracking-tight text-purple-950 mb-2">Hoja de vida de Equipo</h1>
              <div className="flex items-center justify-end gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*:last-child]:md:col-span-2">
                  <Badge variant="outline" className="justify-center bg-white/50 hover:bg-white transition-colors">
                    Código: FHV-02
                  </Badge>
                  <Badge variant="outline" className="justify-center bg-white/50 hover:bg-white transition-colors">
                    Versión: 01
                  </Badge>
                  <Badge variant="outline" className="justify-center bg-white/50 hover:bg-white transition-colors">
                    Vigente desde: 18-02-2025
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 px-6">
          {/*** Client ***/}
          <section className="animate-in fade-in-50 duration-500">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Cliente Principal</h2>
              </div>
            </div>

            <div className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-purple-100">
                      <AvatarImage src={imgClient?.[0]?.url} className="object-contain" />
                      <AvatarFallback className="bg-purple-50 text-purple-700">
                        {cv?.office?.headquarter?.client?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {cv?.office?.headquarter?.client?.name}
                      </h3>
                      <Badge variant="outline" className="bg-purple-50">
                        Cliente registrado ®
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-purple-100" />

                  <div className="grid gap-4">
                    <TooltipProvider>
                      {[{
                        icon: <Mail className="w-4 h-4 text-purple-600" />,
                        label: "Email",
                        value: cv?.office?.headquarter?.client?.email
                      }, {
                        icon: <Phone className="w-4 h-4 text-purple-600" />,
                        label: "Teléfono",
                        value: cv?.office?.headquarter?.client?.phone
                      }, {
                        icon: <FileText className="w-4 h-4 text-purple-600" />,
                        label: "NIT",
                        value: cv?.office?.headquarter?.client?.nit
                      }].map((item, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 bg-white hover:bg-purple-50 transition-colors cursor-pointer group"
                              onClick={() => copyToClipboard(item.value || '')}
                            >
                              {item.icon}
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="font-medium">{item.value || 'No disponible'}</p>
                              </div>
                              <Copy className="w-3 h-3 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click para copiar</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-purple-100 bg-purple-50/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      Información de la oficina
                    </h4>
                    <div className="grid gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Servicio</p>
                        <p className="font-medium">{cv?.service}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Oficina</p>
                        <p className="font-medium">{cv?.office?.name}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Sede</p>
                        <p className="font-medium">{cv?.office?.headquarter?.name}</p>
                      </div>
                    </div>
                  </div>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Info className="w-4 h-4 mr-2" />
                        Ver más información
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Detalles adicionales</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <div>
                            Última actualización
                            <p>{cv?.updatedAt && new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.updatedAt))}</p>
                          </div>
                          <div>
                            Fecha de creación
                            <p>{cv?.createdAt && new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.createdAt))}</p>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/*** BasicData and equipmentClassification ***/}
          <section className="animate-in fade-in-50 duration-500">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Información General</h2>
              </div>
            </div>

            <div className="mt-6">
              <Card className="bg-white/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-6">
                      <div className="grid gap-6">
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
                                  className="flex items-center gap-4 p-4 rounded-lg border border-purple-100 bg-white hover:bg-purple-50 transition-all cursor-pointer group"
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

                      <Separator className="my-6 bg-purple-100" />

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-purple-600" />
                          Detalles Adicionales
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Tipo", value: cv?.typeClassification },
                            { label: "Clasificación", value: cv?.useClassification },
                            { label: "Riesgo", value: cv?.riskClassification },
                            { label: "Estado", value: "Activo" } // Asumiendo que existe un campo de estado
                          ].map((item, index) => (
                            <Badge key={index} variant="outline" className="justify-start gap-2 py-1.5 px-3">
                              <span className="text-muted-foreground">{item.label}:</span>
                              <span>{item.value}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative group" onClick={() => window.open(imgCv?.[0]?.url, '_blank')}>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {imgCv && (
                        <img
                          className="w-full h-full object-cover"
                          src={imgCv[0]?.url || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
                          alt="Equipo"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-semibold mb-2">Imagen del Equipo</h4>
                        <p className="text-sm">Haga clic para ver en tamaño completo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Fuentes de Alimentación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cv?.powerSupply.map((source, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-50 hover:bg-purple-100 transition-colors">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    Tecnología Predominante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cv?.technologyPredominant.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-50 hover:bg-purple-100 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/*** Details associated ***/}
          <section className="animate-in fade-in-50 duration-500">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Detalles Asociados</h2>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <Card className="bg-white/50">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
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
                              className="p-3 rounded-lg border border-purple-100 bg-white hover:bg-purple-50 transition-all cursor-pointer group"
                              onClick={() => copyToClipboard(item.value || '')}
                            >
                              <div className="flex items-center gap-2 text-purple-600 mb-1">
                                {item.icon}
                                <span className="text-xs font-medium">{item.label}</span>
                              </div>
                              <p className="font-medium truncate">{item.value || 'No disponible'}</p>
                              <Copy className="w-3 h-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Fabricante",
                    icon: <Factory className="w-5 h-5" />,
                    data: cv?.manufacturer,
                    fields: [
                      { key: 'name' as const, label: 'Nombre' },
                      { key: 'phone' as const, label: 'Teléfono' },
                      { key: 'country' as const, label: 'País' }
                    ]
                  },
                  {
                    title: "Proveedor",
                    icon: <Truck className="w-5 h-5" />,
                    data: cv?.supplier,
                    fields: [
                      { key: 'name' as const, label: 'Nombre' },
                      { key: 'phone' as const, label: 'Teléfono' },
                      { key: 'city' as const, label: 'Ciudad' }
                    ]
                  },
                  {
                    title: "Representante",
                    icon: <UserCheck className="w-5 h-5" />,
                    data: cv?.representative,
                    fields: [
                      { key: 'name' as const, label: 'Nombre' },
                      { key: 'phone' as const, label: 'Teléfono' },
                      { key: 'city' as const, label: 'Ciudad' }
                    ]
                  }
                ].map((stakeholder, index) => (
                  <Card key={index} className="bg-white/50 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                        {stakeholder.icon}
                        {stakeholder.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stakeholder.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{field.label}:</span>
                            <Badge variant="outline" className="font-normal">
                              {stakeholder.data?.[field.key] || 'N/A'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link className="w-full" to={`https://wa.me/${stakeholder.data?.phone}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full justify-center">
                          <Mail className="w-4 h-4" />
                          Contactar
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <Separator />

          {/* Mantenimiento */}
          <section className="animate-in fade-in-50 duration-500 mt-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 -mx-6 px-6 py-4 border-y border-purple-100">
              <div className="flex items-center gap-2">
                <WrenchIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Mantenimiento</h2>
              </div>
            </div>

            <div className="mt-6">
              <Card className="bg-white/50">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Tipo de Mantenimiento</h3>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <InfoIcon className="h-4 w-4" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p>Los tipos de mantenimiento indican las diferentes formas en que se cuida este equipo.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cv?.typeMaintenance.map((type, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Frecuencia de Mantenimiento</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20">
                            <CircularProgressbar
                              value={75}
                              text={`${cv?.frequencyMaintenance || '?'}`}
                              styles={buildStyles({
                                textSize: '22px',
                                pathColor: `rgba(147, 51, 234, ${75 / 100})`,
                                textColor: '#6b21a8',
                                trailColor: '#e9d5ff',
                              })}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Próximo mantenimiento en</p>
                            <p className="text-2xl font-bold text-purple-700">45 días</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Manual Disponible</h3>
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <FileText className="w-8 h-8 text-purple-600" />
                          <div>
                            <p className="font-medium">{cv?.manualsMaintenance || 'No especificado'}</p>
                            <p className="text-sm text-muted-foreground">Tipo de manual disponible</p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Estado Actual</h3>
                        <div className="relative h-2 bg-purple-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-500 ease-in-out"
                            style={{ width: '80%' }}
                          ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-purple-700 font-medium">80% Operativo</span>
                          <span className="text-muted-foreground">Último chequeo: 15 días atrás</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button className="w-full" variant="outline">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Programar próximo mantenimiento
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Mantenimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Técnico</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: '2025-01-15', type: 'Preventivo', technician: 'Juan Pérez', status: 'Completado' },
                        { date: '2024-07-22', type: 'Correctivo', technician: 'María López', status: 'Pendiente' },
                        { date: '2024-01-10', type: 'Preventivo', technician: 'Carlos Ruiz', status: 'Completado' },
                      ].map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{record.technician}</TableCell>
                          <TableCell>
                            <Badge variant={record.status === 'Completado' ? 'outline' : 'destructive'} className={`${record.status === 'Completado' && 'bg-green-200'}`}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
                  <TableCell>{cv?.technicalCharacteristics.voltage || '--'}</TableCell>
                  <TableCell className="font-medium">Corriente</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.amperage || '--'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Potencia</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.power || '--'}</TableCell>
                  <TableCell className="font-medium">Frecuencia</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.frequency || '--'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Presión</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.pressure || '--'}</TableCell>
                  <TableCell className="font-medium">Velocidad</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.speed || '--'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Humedad</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.humidity || '--'}</TableCell>
                  <TableCell className="font-medium">Temperatura</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.temperature || '--'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Peso</TableCell>
                  <TableCell>{cv?.technicalCharacteristics.weight || '--'}</TableCell>
                  <TableCell className="font-medium"></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator className="bg-purple-100" />

          {/* Inspection Configuration */}
          {!ins ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Sin inspección configurada</h2>
                <div className="flex items-center gap-2">
                  No se ha configurado ninguna inspección para el equipo
                  <Badge />
                </div>
              </section>
              <Separator />
            </>
          ) : (
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
          {!acc || acc.length === 0 ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Accesorios</h2>
                <div className="grid gap-4">
                  <p className="text-sm font-medium">No hay accesorios configurados</p>
                </div>
              </section>
              <Separator />
            </>
          ) : (
            <>
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
              <Separator />
            </>
          )}

          <Separator />

          {/* Characteristics */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Características</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Características del equipo</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {cv?.characteristics}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Recomendaciones del fabricante</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {cv?.recommendationsManufacturer}
                </p>
              </div>
            </div>
          </section>

          {/* Provider service */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Proveedor del servicio</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <p className="text-sm font-medium">Nombre del proveedor</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {com?.[0]?.name}
                </p>
                <p className="text-sm font-medium">Invima</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {com?.[0]?.invima}
                </p>
              </div>

              <img
                className="w-24 h-24 rounded-md"
                src={imgCom?.[0]?.url || ''}
                alt="Logo proveedor"
              />
            </div>
          </section>
        </CardContent >
      </Card >
    </div >
  )
}

export default PreviewCurriculumSection