import { ThemeContextProps, User } from "@/interfaces/context.interface"
import { CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeaderPreviewCVProps extends ThemeContextProps {
  client: User | undefined
  isMobile: boolean
}

const HeaderPreviewCV = ({ theme, client, isMobile }: HeaderPreviewCVProps) => {
  return (
    <CardHeader className={cn(
      'flex flex-col sm:flex-row justify-between items-center',
      'p-3 space-y-6 rounded-t-xl border-b bg-gradient-to-r',
      theme === 'dark' ? 'from-purple-800 to-purple-100' : 'from-purple-200 to-purple-100'
    )}>
      {/*** Header ***/}
      {client && (
        <div className="relative max-w-72 max-h-40 transition-transform hover:scale-105">
          <img
            alt="Logo Cliente"
            className="object-contain rounded-lg border border-purple-100 shadow-sm"
            src={client?.metadata?.logo || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
          />
        </div>
      )}
      <div className="text-right">
        <h1 className="text-3xl font-bold tracking-tight text-purple-950 mb-2">{`Hoja de vida equipo ${!isMobile ? 'biomedico' : ''} `}</h1>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <div className="grid w-full sm:w-auto md:grid-cols-2 gap-2 [&>*:last-child]:md:col-span-2">
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
    </CardHeader>
  )
}

export default HeaderPreviewCV