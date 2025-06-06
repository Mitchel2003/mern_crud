import { AlertCircle, Info, Calendar, CheckCircle, ImageIcon, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card"
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { Solicit } from "@/interfaces/context.interface"
import { CustomDrawer } from "#/common/elements/Drawer"
import { Badge } from "#/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps { status: Solicit['status'] }
interface DetailsSolicitProps extends ThemeContextProps {
  children?: React.ReactNode
  onClose: () => void
  solicit: Solicit
  isOpen: boolean
}

/**
 * Componente específico para mostrar opciones de cronogramas
 * Utiliza el CustomDrawer como base
 */
export const DetailsSolicitDrawer = ({ isOpen, onClose, theme, solicit, children }: DetailsSolicitProps) => {
  if (!solicit) return null

  return (
    <CustomDrawer
      size="lg"
      open={isOpen}
      theme={theme}
      position="bottom"
      title="Detalles de la Solicitud"
      onOpenChange={(open) => !open && onClose()}
      description="Información detallada de la solicitud asociada a esta actividad"
    >
      <div className="space-y-4">
        <Image photoUrl={solicit.photoUrl} />
        <div className="flex gap-2">
          <PriorityBadge priority={solicit.priority} />
          <StatusBadge status={solicit.status} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">{solicit.message}</p>
          </CardContent>
        </Card>
        <EquipmentCard cv={solicit.curriculum} />
        {children}
      </div>
    </CustomDrawer>
  )
}

export default DetailsSolicitDrawer
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------atoms--------------------------------------------------*/
/** Component to show the image of the equipment */
const Image = ({ photoUrl }: { photoUrl?: string }) => (
  <div className="w-full flex justify-center">
    {photoUrl
      ? (<img src={photoUrl} alt="Foto de la solicitud" className="rounded-xl object-cover max-h-48 border border-zinc-200 dark:border-zinc-700 shadow" />)
      : (
        <div className="flex items-center justify-center w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <ImageIcon className="h-12 w-12 text-zinc-400" />
        </div>
      )
    }
  </div>
)

/** Component to show the priority of the equipment */
const PriorityBadge = ({ priority }: { priority: boolean }) => (
  <Badge variant={priority ? "destructive" : "warning"}>
    {priority ? (<> <AlertCircle className="h-4 w-4 mr-1" /> Prioritaria </>) : (<> <Info className="h-4 w-4 mr-1" /> Normal </>)}
  </Badge>
)

/** Component to show the status of the equipment */
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const Icon = () => (
    status === "pendiente" ? <Calendar className="h-4 w-4 mr-1" /> :
      status === "asignado" ? <Clock className="h-4 w-4 mr-1" /> :
        status === "cerrado" ? <CheckCircle className="h-4 w-4 mr-1" /> : <></>
  )
  return (
    <Badge variant="secondary" className={cn(getColorStatus(status))}>
      <Icon /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

/** Component to show the equipment related to the activity */
const EquipmentCard = ({ cv }: { cv?: Curriculum }) => {
  if (!cv) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipo Relacionado</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          <li><span className="font-medium">Nombre:</span> {cv.name}</li>
          <li><span className="font-medium">Modelo:</span> {cv.modelEquip}</li>
          <li><span className="font-medium">Serie:</span> {cv.serie}</li>
          <li><span className="font-medium">Marca:</span> {cv.brand}</li>
          <li><span className="font-medium">Servicio:</span> {cv.service}</li>
        </ul>
      </CardContent>
    </Card>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Function to get the color of the status */
const getColorStatus = (status: Solicit['status']) => {
  switch (status) {
    case 'pendiente': return "bg-muted-foreground"
    case 'asignado': return "bg-yellow-300 dark:bg-yellow-600"
    case 'cerrado': return "bg-green-300 dark:bg-green-600"
  }
}