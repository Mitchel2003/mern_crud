import { ThemeContextProps } from "@/interfaces/context.interface"
import { CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeaderPreviewCVProps extends ThemeContextProps {
  client: string
}

const HeaderPreviewCV = ({ theme, client }: HeaderPreviewCVProps) => {
  return (
    <CardHeader className={cn(
      'p-6 space-y-2 rounded-t-xl border-b bg-gradient-to-r',
      theme === 'dark'
        ? 'from-purple-800 to-purple-100'
        : 'from-purple-200 to-purple-100'
    )}>
      {/*** Header ***/}
      <div className="flex justify-between items-start">
        {client && (
          <div className="relative max-w-64 max-h-40 transition-transform hover:scale-105">
            <img
              className="object-contain rounded-lg border border-purple-100 shadow-sm"
              src={client || "https://placehold.co/400x400/e2e2e2/666666?text=Sin+imagen"}
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
  )
}

export default HeaderPreviewCV