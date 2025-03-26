import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Building2, Copy, FileText, Info, Mail, Phone, Users2 } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#/ui/hover-card"
import { AvatarFallback, AvatarImage } from "#/ui/avatar"
import { Separator } from "#/ui/separator"
import { Avatar } from "#/ui/avatar"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { Curriculum } from "@/interfaces/context.interface"
import { cn, copyToClipboard } from "@/lib/utils"

interface ClientPreviewCVProps extends ThemeContextProps {
  client: string
  cv: Curriculum
}

const ClientPreviewCV = ({ cv, client, theme }: ClientPreviewCVProps) => {
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn(
        '-mx-6 px-6 py-4 border-y bg-gradient-to-r',
        theme === 'dark'
          ? 'from-purple-50 to-purple-100/50  border-purple-100'
          : 'from-purple-50 to-purple-100/50  border-purple-100'
      )}
      >
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Cliente Principal</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-purple-100">
              <AvatarImage src={client} className="object-contain" />
              <AvatarFallback className="bg-purple-50 text-purple-700">
                {cv?.office?.headquarter?.user?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {cv?.office?.headquarter?.user?.username}
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
                value: cv?.office?.headquarter?.user?.email
              }, {
                icon: <Phone className="w-4 h-4 text-purple-600" />,
                label: "Teléfono",
                value: cv?.office?.headquarter?.user?.phone
              }, {
                icon: <FileText className="w-4 h-4 text-purple-600" />,
                label: "NIT",
                value: cv?.office?.headquarter?.user?.nit
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
    </section>
  )
}

export default ClientPreviewCV