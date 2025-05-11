import { BookOpen, FileText, Scale, Shield, Clock } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { cn } from "@/lib/utils"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/ui/tabs"
import { CustomDrawer } from "#/common/elements/Drawer"
import { Badge } from "#/ui/badge"

export interface RegulationsDrawerProps extends ThemeContextProps {
  setOpen: (open: string | undefined) => void
  tabOpen: string | undefined
}

/**
 * Componente específico para mostrar opciones de regulaciones
 * Utiliza el CustomDrawer como base con un diseño mejorado
 */
const RegulationsDrawer = ({ theme, tabOpen, setOpen }: RegulationsDrawerProps) => {
  return (
    <CustomDrawer
      size="full"
      theme={theme}
      open={!!tabOpen}
      position="bottom"
      title="Normativas y Regulaciones"
      onOpenChange={(open) => !open && setOpen(undefined)}
      description="Información detallada sobre las normativas aplicables a equipos médicos"
      footer={
        <div className={cn("flex items-center justify-between w-full")}>
          <div className="flex items-center">
            <Clock className={cn("h-4 w-4 mr-2", theme === "dark" ? "text-gray-400" : "text-gray-500")} />
            <span className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
              Última actualización: 29 de abril de 2025
            </span>
          </div>
        </div>
      }
    >
      <div className="pb-4">
        <Tabs value={tabOpen} onValueChange={setOpen} defaultValue="resolucion" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="iso">ISO 9001:2015</TabsTrigger>
            <TabsTrigger value="decreto">Decreto 4725</TabsTrigger>
            <TabsTrigger value="resolucion">Resolución 2100</TabsTrigger>
            <TabsTrigger value="habilitacion">Manual de Habilitación</TabsTrigger>
          </TabsList>

          {/* Contenido para cada tab */}
          <TabsContent value="iso">
            <RegulationContent
              theme={theme}
              icon={Scale}
              color="green"
              title="ISO 9001:2015"
              content={isoContent}
              subtitle="Sistema de gestión de calidad"
            />
          </TabsContent>

          <TabsContent value="decreto">
            <RegulationContent
              theme={theme}
              color="purple"
              icon={FileText}
              content={decretoContent}
              title="Decreto 4725 de 2005"
              subtitle="Régimen de registros sanitarios, permisos y vigilancia sanitaria"
            />
          </TabsContent>

          <TabsContent value="resolucion">
            <RegulationContent
              color="blue"
              theme={theme}
              icon={Shield}
              content={resolucionContent}
              title="Resolución 2100 de 2019"
              subtitle="Requisitos para la gestión de tecnología biomédica"
            />
          </TabsContent>

          <TabsContent value="habilitacion">
            <RegulationContent
              theme={theme}
              color="amber"
              icon={BookOpen}
              content={habilitacionContent}
              title="Manual de Habilitación"
              subtitle="Inscripción de Prestadores y Habilitación de Servicios de Salud"
            />
          </TabsContent>
        </Tabs>
      </div>
    </CustomDrawer>
  )
}

// Interfaces y componentes adicionales
interface RegulationContentProps extends ThemeContextProps {
  color: "blue" | "green" | "purple" | "amber"
  content: RegulationSection[]
  icon: React.ElementType
  subtitle: string
  title: string
}

interface RegulationSection { content: string }
const RegulationContent = ({ theme, title, subtitle, icon: Icon, color, content }: RegulationContentProps) => {
  const colorClass = colorClasses(theme)
  return (
    <Card className={cn(theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100")}>
      <CardHeader className={cn("bg-gradient-to-r", colorClass[color].header)}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", colorClass[color].icon)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className={cn(theme === "dark" ? "text-white" : "text-gray-800")}>{title}</CardTitle>
            <CardDescription className={cn(theme === "dark" ? "text-gray-300" : "text-gray-600")}>{subtitle}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={cn(colorClass[color].badge)}>Normativa vigente</Badge>
          <Badge variant="outline" className={cn(colorClass[color].badge)}>Aplicable a equipos médicos</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {content.map((section, index) => (
          <Accordion key={index} type="single" defaultValue={' '} className="w-full" collapsible>
            <AccordionItem value={' '} className={cn("mb-2 border rounded-lg", colorClass[color].accordion)}>
              <AccordionTrigger className="px-4 hover:no-underline" />
              <AccordionContent className="px-4 pb-4">
                <p className={cn("text-sm whitespace-pre-line", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
                  {section.content}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  )
}

export default RegulationsDrawer
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const isoContent: RegulationSection[] = [{ content: "Establece los requisitos para implementar un Sistema de Gestión de la Calidad (SGC), enfocado en la mejora continua, la satisfacción del usuario y el control eficiente de los procesos. Para los prestadores de servicios de salud, su aplicación permite estructurar de forma organizada las actividades, mejorar la calidad de la atención y fortalecer la toma de decisiones. \n\n La gestión documental es fundamental para mantener trazabilidad, evidenciar conformidad y garantizar el control de la información." }]
const decretoContent: RegulationSection[] = [{ content: "Define los estándares que deben cumplir los prestadores de servicios de salud para obtener y mantener la habilitación. Establece criterios relacionados con la infraestructura, el talento humano, los procesos asistenciales y la gestión de los equipos. Su adecuada aplicación garantiza la calidad y seguridad en la prestación del servicio. \n\n La gestión documental es clave para evidenciar el cumplimiento de cada estándar exigido y facilitar auditorías o procesos de inspección." }]
const resolucionContent: RegulationSection[] = [{ content: "Regula todo el ciclo de vida de los dispositivos médicos en Colombia, desde su fabricación hasta su disposición final. \n\n Obliga a los prestadores de servicios de salud a llevar un control riguroso de los equipos, sus mantenimientos, condiciones de uso y estado técnico. La gestión documental es esencial para cumplir con esta regulación, permitiendo demostrar la seguridad, funcionalidad y trazabilidad de los dispositivos en beneficio de la atención segura al paciente." }]
const habilitacionContent: RegulationSection[] = [{ content: "Este manual, emitido por el Ministerio de Salud, orienta a los prestadores sobre los pasos y requisitos para inscribirse en el Registro Especial de Prestadores de Servicios de Salud (REPS) y habilitar los servicios ofrecidos. Detalla la documentación requerida, los criterios a cumplir y los procedimientos para reportar información. \n\n Realizar una gestión documental adecuada permite asegurar que toda la información esté disponible, actualizada y organizada, facilitando los procesos de inscripción, renovación y auditoría." }]

const colorClasses = (theme: string) => ({
  blue: {
    header: theme === "dark" ? "from-blue-950 to-blue-900" : "from-blue-50 to-blue-100",
    icon: theme === "dark" ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-600",
    badge: theme === "dark" ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-600",
    accordion: theme === "dark" ? "border-blue-800" : "border-blue-200",
  },
  green: {
    header: theme === "dark" ? "from-green-950 to-green-900" : "from-green-50 to-green-100",
    icon: theme === "dark" ? "bg-green-800 text-green-200" : "bg-green-100 text-green-600",
    badge: theme === "dark" ? "bg-green-800 text-green-200" : "bg-green-100 text-green-600",
    accordion: theme === "dark" ? "border-green-800" : "border-green-200",
  },
  purple: {
    header: theme === "dark" ? "from-purple-950 to-purple-900" : "from-purple-50 to-purple-100",
    icon: theme === "dark" ? "bg-purple-800 text-purple-200" : "bg-purple-100 text-purple-600",
    badge: theme === "dark" ? "bg-purple-800 text-purple-200" : "bg-purple-100 text-purple-600",
    accordion: theme === "dark" ? "border-purple-800" : "border-purple-200",
  },
  amber: {
    header: theme === "dark" ? "from-amber-950 to-amber-900" : "from-amber-50 to-amber-100",
    icon: theme === "dark" ? "bg-amber-800 text-amber-200" : "bg-amber-100 text-amber-600",
    badge: theme === "dark" ? "bg-amber-800 text-amber-200" : "bg-amber-100 text-amber-600",
    accordion: theme === "dark" ? "border-amber-800" : "border-amber-200",
  }
})