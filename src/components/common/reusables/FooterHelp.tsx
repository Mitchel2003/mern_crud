import { CheckCircle, Clock, FileText, LifeBuoy, MessageSquare, Phone, Shield } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/avatar"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

const FooterHelp = ({ theme }: ThemeContextProps) => {
  const isMobile = useIsMobile()
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className={cn("overflow-hidden border-0 shadow-lg", theme === "dark" ? "bg-gradient-to-br from-zinc-900 to-zinc-950" : "bg-white")}>
        <CardHeader className={cn("pb-4", theme === "dark" ? "bg-zinc-900/50 border-b border-zinc-800" : "bg-blue-50/50 border-b border-blue-100/50")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("hidden sm:block p-2 rounded-lg", theme === "dark" ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-600")}>
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className={cn("text-xl", theme === "dark" ? "text-white" : "text-gray-800")}>
                  Sistema de Gestión Integral
                </CardTitle>
                <CardDescription className={cn(theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Control completo de sus equipos médicos y mantenimientos
                </CardDescription>
              </div>
            </div>
            <div className="hidden sm:flex flex-row gap-2">
              <Badge variant="outline" className={cn(theme === "dark" ? "bg-blue-900/20 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200")}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Certificado
              </Badge>
              <Badge variant="outline" className={cn(theme === "dark" ? "bg-green-900/20 text-green-300 border-green-800" : "bg-green-50 text-green-700 border-green-200")}>
                <Shield className="h-3 w-3 mr-1" />
                ISO 9001
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className={cn("grid w-full grid-cols-3 rounded-none p-0 h-12", theme === "dark" ? "bg-zinc-900 border-b border-zinc-800" : "bg-gray-50 border-b border-gray-100")}>
              <TabsTrigger
                value="features"
                className={cn("rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500",
                  theme === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-600 data-[state=active]:text-blue-600"
                )}
              >
                {!isMobile && <FileText className="h-4 w-4 mr-2" />}
                Características
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className={cn("rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500",
                  theme === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-600 data-[state=active]:text-blue-600"
                )}
              >
                {!isMobile && <CheckCircle className="h-4 w-4 mr-2" />}
                Beneficios
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className={cn("rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500",
                  theme === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-600 data-[state=active]:text-blue-600"
                )}
              >
                {!isMobile && <LifeBuoy className="h-4 w-4 mr-2" />}
                Soporte
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{
                  icon: <FileText className="h-5 w-5" />,
                  title: "Gestión Documental",
                  description: "Mantenga toda la documentación técnica de sus equipos organizada y accesible desde cualquier dispositivo."
                }, {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Mantenimientos Programados",
                  description: "Visualize las fechas de sus proximos mantenimientos preventivos."
                }].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50" : "bg-white border-gray-100 hover:bg-gray-50/50")}
                  >
                    <div className={cn("p-2 rounded-lg w-fit mb-3", theme === "dark" ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-600")}>
                      {feature.icon}
                    </div>
                    <h3 className={cn("font-medium mb-2", theme === "dark" ? "text-white" : "text-gray-800")}>
                      {feature.title}
                    </h3>
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Reducción de tiempos de inactividad de equipos",
                  "Cumplimiento de normativas y estándares internacionales",
                  "Optimización de recursos técnicos y humanos",
                  "Trazabilidad completa de todas las operaciones",
                  "Reportes personalizados para toma de decisiones",
                  "Integración con otros sistemas institucionales"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className={cn("p-1 rounded-full mt-0.5", theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600")}>
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <p className={cn(theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="support" className="p-6">
              <div className="grid gap-6">
                {/** temporally disabled */}
                {/* <div className={cn("col-span-1 md:col-span-2 p-4 rounded-lg border",
                  theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-100"
                )}>
                  <h3 className={cn("font-medium mb-3", theme === "dark" ? "text-white" : "text-gray-800")}>
                    Recursos de Ayuda
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: <BookOpen className="h-4 w-4" />, text: "Guía de usuario completa" },
                      { icon: <FileText className="h-4 w-4" />, text: "Manuales técnicos" },
                      { icon: <MessageSquare className="h-4 w-4" />, text: "Preguntas frecuentes" },
                      { icon: <Users className="h-4 w-4" />, text: "Capacitaciones en línea" }
                    ].map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="flex items-center gap-2 cursor-pointer hover:underline"
                      >
                        <div className={cn("p-1 rounded-full", theme === "dark" ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600")}>
                          {resource.icon}
                        </div>
                        <span className={cn("text-sm", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                          {resource.text}
                        </span>
                        <ArrowRight className="h-3 w-3 ml-auto" />
                      </motion.div>
                    ))}
                  </div>
                </div> */}

                <div className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-blue-900/10 border-blue-900/30" : "bg-blue-50 border-blue-100")}>
                  <h3 className={cn("font-medium mb-3 flex items-center gap-2", theme === "dark" ? "text-blue-300" : "text-blue-700")}>
                    <LifeBuoy className="h-4 w-4" />
                    Contacto Directo
                  </h3>

                  <div className="space-y-3">
                    {[{ icon: <Phone className="h-4 w-4" />, text: "Soporte técnico 24/7" }].map((contact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        onClick={() => window.open("https://wa.me/573244814033", "_blank")}
                        className={cn("flex items-center gap-2 p-2 rounded cursor-pointer",
                          theme === "dark"
                            ? "hover:bg-blue-900/20 text-blue-100"
                            : "hover:bg-blue-100/50 text-blue-700"
                        )}
                      >
                        {contact.icon}
                        <span className="text-sm">{contact.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className={cn("flex flex-col sm:flex-row justify-between items-center p-4 border-t space-y-4", theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-100 bg-gray-50/50")}>
          <div className="flex items-center gap-2">
            <Avatar className="h-14 w-14">
              <AvatarImage src="https://i.ibb.co/B5jVSxmL/panihida.jpg" />
              <AvatarFallback className={cn(theme === "dark" ? "bg-zinc-800 text-zinc-400" : "bg-gray-200 text-gray-600")}>
                Michael (Desarrollador)
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={cn("text-xs font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                Soporte Técnico
              </p>
              <p className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                Michael (Desarrollador)
              </p>
              <p className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                Tiempo de respuesta: <span className="font-medium">15 minutos a 30 minutos</span>
              </p>
            </div>
          </div>

          <Button onClick={() => window.open("https://wa.me/573244814033", "_blank")} size="sm" className={cn(theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Contactar ahora
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default FooterHelp