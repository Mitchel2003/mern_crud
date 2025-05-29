import { ArrowUpDown, Battery, CheckCircle, ChevronDown, Clipboard, ClipboardX, Droplet, ExternalLink, FileText, Gauge, Info, InfoIcon, RefreshCw, Scale, Settings2, Shield, Thermometer, Wind, WrenchIcon, Zap } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#/ui/collapsible'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '#/ui/hover-card'
import { Card, CardContent, CardHeader, CardTitle } from '#/ui/card'
import { ScrollArea } from '#/ui/scroll-area'
import { Separator } from '#/ui/separator'
import { Button } from '#/ui/button'
import { Badge } from '#/ui/badge'
import { cn } from '@/lib/utils'

import { extractMetadataUrl, getInspectionTags, getFileType } from '@/constants/format.constants'
import { Curriculum, Inspection, ThemeContextProps } from '@/interfaces/context.interface'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

export interface MaintenancePreviewCVProps extends ThemeContextProps {
  ins?: Inspection
  cv: Curriculum
  auth?: boolean
}

const MaintenancePreviewCV = ({ cv, ins, auth, theme }: MaintenancePreviewCVProps) => {
  const fileNames = extractMetadataUrl(cv?.metadata?.files || [])
  const maintenanceDays = getMaintenanceDays(cv)
  const circleValue = calculateCircleValue(cv)
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn('-mx-6 px-6 py-4 border-y bg-gradient-to-r', theme === 'dark'
        ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100'
        : 'from-purple-50 to-purple-100/50 border-purple-100'
      )}>
        <div className="flex items-center gap-2">
          <WrenchIcon className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
          <h2 className="text-xl font-semibold">Mantenimiento</h2>
        </div>
      </div>

      <div className="mt-6">
        <Card className={cn(theme === 'dark' ? 'bg-zinc-800' : 'bg-purple-50')}>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid md:grid-cols-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Tipo de Mantenimiento</h3>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn(theme === 'dark' ? 'hover:bg-zinc-700' : '')}>
                        <InfoIcon className={cn("h-4 w-4", theme === 'dark' ? 'text-purple-300' : '')} />
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
                      className={cn("px-3 py-1 text-sm transition-colors", theme === 'dark' ? 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-1">
                <div className="flex items-center justify-between mt-5">
                  <h3 className="text-lg font-semibold mb-3">Frecuencia de Mantenimiento</h3>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn(theme === 'dark' ? 'hover:bg-zinc-700' : '')}>
                        <InfoIcon className={cn("h-4 w-4", theme === 'dark' ? 'text-purple-300' : '')} />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p>La frecuencia de mantenimiento indica el intervalo de tiempo entre los mantenimientos.</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="w-20 h-20">
                    <CircularProgressbar
                      value={circleValue}
                      styles={buildStyles({
                        pathColor: `rgba(147, 51, 234, ${circleValue / 100})`,
                        textSize: '16px', textColor: '#6b21a8', trailColor: '#e9d5ff',
                      })}
                    />
                  </div>
                  <div>
                    <p className={cn("text-sm text-muted-foreground", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>Próximo mantenimiento en</p>
                    <p className={cn("text-2xl font-bold", theme === 'dark' ? 'text-purple-300' : 'text-purple-700')}>{maintenanceDays} días</p>
                    <p className={cn("text-xs text-muted-foreground", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>Basado en {cv?.employmentMaintenance || 'uso estándar'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="h-full">
                <h3 className="text-lg font-semibold mb-3">Manuales Disponibles</h3>
                <div className={cn("h-auto flex flex-col rounded-lg border overflow-hidden", theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-purple-50 border-purple-100')}>
                  {/* Encabezado con icono y título */}
                  <div className={cn("flex items-center gap-3 p-4 border-b", theme === 'dark' ? 'border-zinc-700 bg-zinc-800' : 'border-purple-100 bg-purple-100/50')}>

                    <div className={cn("p-2 rounded-full", theme === 'dark' ? 'bg-zinc-700' : 'bg-white')}>
                      <FileText className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                    </div>
                    <div>
                      <h4 className={cn("font-medium", theme === 'dark' ? 'text-white' : 'text-gray-800')}>Documentación técnica</h4>
                      <p className={cn("text-xs text-muted-foreground", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>Manuales y guías para este equipo</p>
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className={cn("p-4 flex-1 flex flex-col", theme === 'dark' ? 'bg-zinc-800/80' : 'bg-purple-50')}>
                    {/* Tipos de manuales disponibles */}
                    <div className="mb-4">
                      <p className={cn("text-sm font-medium text-muted-foreground mb-2", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>Tipos de manuales:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(cv?.manualsMaintenance) && cv.manualsMaintenance.length > 0 ? (
                          cv.manualsMaintenance.map((manual, index) => (
                            <Badge key={index} variant="outline" className={cn("px-3 py-1 text-sm transition-colors", theme === 'dark' ? 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}>
                              <FileText className="w-3.5 h-3.5 mr-1.5" />
                              {manual}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground italic ">
                            {typeof cv?.manualsMaintenance === 'string' ? cv?.manualsMaintenance : 'No especificado'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Línea separadora */}
                    <Separator className={cn("my-3", theme === 'dark' ? 'bg-zinc-700' : '')} />

                    {/* Archivos adjuntos */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-purple-300' : 'text-purple-700')}>Documentos disponibles</p>
                        <Badge variant="outline" className={cn("text-xs", theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-50')}>
                          {fileNames?.length || 0} archivos
                        </Badge>
                      </div>

                      {fileNames && fileNames.length > 0 ? (
                        <div className="space-y-2 mt-3 max-h-[240px] overflow-y-auto pr-1">
                          {fileNames.map((fileName, index) => (
                            <div
                              key={index}
                              className={cn("flex items-center justify-between p-2.5 rounded-md border transition-all duration-200", theme === 'dark' ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700/80' : 'bg-white border-purple-100 hover:border-purple-200 hover:shadow-sm')}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className={cn("p-1.5 rounded", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-50')}>
                                  <FileText className={cn("h-4 w-4 flex-shrink-0", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{fileName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {getFileType(fileName)}
                                  </p>
                                </div>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className={cn("h-8 px-2", theme === 'dark' ? 'text-purple-300 hover:text-purple-200 hover:bg-zinc-700' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50')}
                                      onClick={() => window.open(cv?.metadata?.files?.[index], '_blank')}
                                    >
                                      <ExternalLink className={cn("h-4 w-4 mr-1", theme === 'dark' ? 'text-purple-300' : '')} />
                                      Ver
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : '')}>
                                    <p className="text-xs">Abrir documento en nueva pestaña</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={cn("flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed", theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white border-purple-200')}>
                          <FileText className={cn("w-10 h-10 mb-2", theme === 'dark' ? 'text-zinc-600' : 'text-purple-200')} />
                          <p className={cn("text-sm font-medium", theme === 'dark' ? 'text-zinc-400' : 'text-muted-foreground')}>No hay documentos adjuntos</p>
                          <p className={cn("text-xs mt-1", theme === 'dark' ? 'text-zinc-500' : 'text-muted-foreground')}>Los manuales aparecerán aquí cuando estén disponibles</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Inspecciones */}
      {auth && (
        <Card className={cn("mt-6", theme === 'dark' ? 'bg-zinc-800' : 'bg-purple-50')}>
          <CardHeader className="border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-purple-600" />
                <CardTitle>Actividades</CardTitle>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Sobre las Actividades</h4>
                    <p className="text-sm text-muted-foreground">
                      Lista de verificaciones necesarias para asegurar el correcto funcionamiento del equipo.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Nombre de la configuración */}
              <div className={cn("flex items-start gap-4 p-4 rounded-lg border", theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-purple-50 border-purple-100')}>
                <div className={cn("p-2 rounded-full", theme === 'dark' ? 'bg-zinc-700' : 'bg-white')}>
                  <Settings2 className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Configuración Actual</h3>
                  <p className="text-sm text-muted-foreground">{ins?.name || 'Sin configuración'}</p>
                </div>
              </div>

              {/* Lista de inspecciones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Lista de Actividades</h3>
                  <Badge variant="outline" className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-50')}>
                    {ins?.typeInspection?.length || 0} puntos de actividad
                  </Badge>
                </div>

                <ScrollArea className={cn("h-[250px] rounded-lg border p-4", theme === 'dark' ? 'border-zinc-700 bg-zinc-800/50' : 'border-purple-100')}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ins?.typeInspection?.map((inspection, index) => (
                      <div
                        key={index}
                        className={cn("group relative p-4 rounded-lg border hover:shadow-md transition-all duration-300", theme === 'dark' ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700/80' : 'bg-white border-purple-100')}
                      >
                        <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity", theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-50')} />

                        <div className="flex items-start gap-4">
                          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm", theme === 'dark' ? 'bg-zinc-700 text-purple-300' : 'bg-purple-100 text-purple-600')}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{inspection}</h4>
                            <div className="flex flex-wrap gap-2">
                              {getInspectionTags(inspection).map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className={cn("text-xs", theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-purple-50')}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {(!ins?.typeInspection || ins.typeInspection.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ClipboardX className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg mb-2">Sin inspecciones configuradas</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          No se han configurado puntos de inspección para este equipo.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Especificaciones Técnicas */}
      <div className="mt-6">
        <Card className={cn(theme === 'dark' ? 'bg-zinc-800' : 'bg-purple-50')}>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[{
                unit: 'V',
                label: 'Voltaje',
                icon: <Zap className="w-4 h-4" />,
                color: 'bg-yellow-100 text-yellow-600',
                value: cv?.technicalCharacteristics.voltage,
              }, {
                unit: 'A',
                label: 'Corriente',
                color: 'bg-blue-100 text-blue-600',
                icon: <Gauge className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.amperage,
              }, {
                unit: 'W',
                label: 'Potencia',
                color: 'bg-green-100 text-green-600',
                icon: <Battery className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.power,
              }, {
                unit: 'Hz',
                label: 'Frecuencia',
                color: 'bg-purple-100 text-purple-600',
                icon: <RefreshCw className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.frequency,
              }, {
                unit: '°C',
                label: 'Temperatura',
                color: 'bg-red-100 text-red-600',
                icon: <Thermometer className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.temperature,
              }, {
                unit: '%',
                label: 'Humedad',
                color: 'bg-cyan-100 text-cyan-600',
                icon: <Droplet className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.humidity,
              }, {
                unit: 'Pa',
                label: 'Presión',
                color: 'bg-orange-100 text-orange-600',
                icon: <ArrowUpDown className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.pressure,
              }, {
                unit: 'm/s',
                label: 'Velocidad',
                color: 'bg-teal-100 text-teal-600',
                icon: <Wind className="w-4 h-4" />,
                value: cv?.technicalCharacteristics.speed,
              }, {
                unit: 'kg',
                label: 'Peso',
                icon: <Scale className="w-4 h-4" />,
                color: 'bg-indigo-100 text-indigo-600',
                value: cv?.technicalCharacteristics.weight,
              }].map((spec, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group cursor-pointer">
                        <div className={cn("relative overflow-hidden p-3 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105", theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white')}>
                          <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-20 transition-opacity group-hover:opacity-100" style={{ background: spec.color }} />
                          <div className={cn("flex items-center gap-3", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                            <div className={cn("p-2 rounded-lg", spec.color)}>
                              {spec.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground truncate">
                                {spec.label}
                              </p>
                              <p className="font-medium truncate">
                                {spec.value ? `${spec.value} ${spec.unit}` : '--'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="text-xs">
                        <p className="font-medium">{spec.label}</p>
                        <p className="text-muted-foreground">
                          Valor nominal: {spec.value ? `${spec.value} ${spec.unit}` : 'No especificado'}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <Separator className={cn("my-6", theme === 'dark' ? 'bg-zinc-700' : '')} />

            <Collapsible>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Info className={cn("w-4 h-4", theme === 'dark' ? 'text-zinc-400' : 'text-muted-foreground')} />
                    <h3 className="text-sm font-medium">Detalles Adicionales</h3>
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className={cn("grid md:grid-cols-2 gap-6 p-4 rounded-lg", theme === 'dark' ? 'bg-zinc-800/80 border border-zinc-700' : 'bg-gray-50')}>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Settings2 className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                      Condiciones de Operación
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Temperatura ambiente', value: '20°C - 25°C' },
                        { label: 'Humedad relativa', value: '30% - 60%' },
                        { label: 'Presión atmosférica', value: '101.3 kPa ± 4 kPa' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <Badge variant="outline" className={cn(theme === 'dark' ? 'border-zinc-700 bg-zinc-800/80' : '')}>{item.value}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Shield className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
                      Certificaciones
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['ISO 9001', 'CE', 'RoHS'].map((cert, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={cn("transition-colors", theme === 'dark' ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-purple-50 hover:bg-purple-100')}
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default MaintenancePreviewCV
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Calcular días hasta el próximo mantenimiento basado en la frecuencia
 * Extraer el número de la frecuencia (asumiendo formato como '12 meses', '6 meses', etc.)
 * @param {Curriculum} cv - Objeto del currículum
 * @returns {string} Cantidad de días
 */
const getMaintenanceDays = (cv: Curriculum): string => {
  if (!cv?.frequencyMaintenance) return '?';
  const frequencyMatch = cv.frequencyMaintenance.match(/\d+/)
  if (!frequencyMatch) return '?'
  const months = parseInt(frequencyMatch[0], 10)
  return String(Math.round(months * 30))
}

/**
 * Calcular el valor para el gráfico circular (porcentaje completado del ciclo de mantenimiento)
 * Simular un valor basado en la frecuencia (en un caso real, esto vendría de la fecha del último mantenimiento)
 * Para este ejemplo, usamos un valor aleatorio entre 25 y 90
 * @param {Curriculum} cv - Objeto del currículum
 * @returns {number} Porcentaje
 */
const calculateCircleValue = (cv: Curriculum): number => {
  if (!cv?.frequencyMaintenance) return 75
  const frequencyMatch = cv.frequencyMaintenance.match(/\d+/)
  if (!frequencyMatch) return 75
  return Math.floor(Math.random() * (90 - 25 + 1)) + 25
}