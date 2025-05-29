import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Building2, Copy, FileText, Info, Mail, Phone, Users2 } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#/ui/hover-card"
import { AvatarFallback, AvatarImage } from "#/ui/avatar"
import { Separator } from "#/ui/separator"
import { Avatar } from "#/ui/avatar"
import { Button } from "#/ui/button"
import { Badge } from "#/ui/badge"

import { ThemeContextProps, User } from "@/interfaces/context.interface"
import { Curriculum } from "@/interfaces/context.interface"
import { cn, copyToClipboard } from "@/lib/utils"

export interface ClientPreviewCVProps extends ThemeContextProps {
  client: User | undefined
  cv: Curriculum
}

const ClientPreviewCV = ({ cv, client, theme }: ClientPreviewCVProps) => {
  return (
    <section className="animate-in fade-in-50 duration-500">
      <div className={cn('-mx-6 px-6 py-4 border-y bg-gradient-to-r', theme === 'dark'
        ? 'from-zinc-800 to-zinc-700 border-zinc-700 text-zinc-100'
        : 'from-purple-50 to-purple-100/50 border-purple-100'
      )}>
        <div className="flex items-center gap-2">
          <Users2 className={cn("w-5 h-5", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
          <h2 className="text-xl font-semibold">Cliente Principal</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className={cn("w-16 h-16 border-2", theme === 'dark' ? 'border-zinc-700' : 'border-purple-100')}>
              <AvatarImage className="object-contain" src={client?.metadata?.logo || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"} />
              <AvatarFallback className={cn(theme === 'dark' ? 'bg-zinc-800 text-zinc-200' : 'bg-purple-50 text-purple-700')}>
                {client?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {client?.username}
              </h3>
              <Badge variant="outline" className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-purple-50')}>
                Cliente registrado ®
              </Badge>
            </div>
          </div>

          <Separator className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-purple-100')} />

          <div className="grid gap-4">
            <TooltipProvider>
              {[{
                label: "Email",
                value: client?.email,
                icon: <Mail className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />,
              }, {
                label: "Teléfono",
                value: client?.phone,
                icon: <Phone className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />,
              }, {
                label: "NIT",
                value: client?.nit,
                icon: <FileText className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />,
              }].map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div onClick={() => copyToClipboard(item.value || '')} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer group", theme === 'dark'
                      ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                      : 'border-purple-100 bg-white hover:bg-purple-50'
                    )}>
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
          <div className={cn("p-4 rounded-lg border", theme === 'dark'
            ? 'border-zinc-700 bg-zinc-800/50'
            : 'border-purple-100 bg-purple-50/50'
          )}>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Building2 className={cn("w-4 h-4", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')} />
              Información del consultorio
            </h4>
            <div className="grid gap-3">
              <div className="text-sm">
                <p className="text-muted-foreground">Servicio</p>
                <p className="font-medium">{cv?.service}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Consultorio</p>
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
              <Button variant="ghost" className={cn("w-full justify-start", theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-700/50' : '')}>
                <Info className={cn("w-4 h-4 mr-2", theme === 'dark' ? 'text-purple-300' : '')} />
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