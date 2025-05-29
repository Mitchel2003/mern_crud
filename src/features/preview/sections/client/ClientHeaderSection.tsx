import { Card, CardHeader, CardTitle, CardDescription } from "#/ui/card"
import { Building2, Phone } from "lucide-react"
import { MailLock } from "@mui/icons-material"

interface ClientHeaderSectionProps {
  clientData: {
    fechaRegistro: string;
    telefono: string;
    nombre: string;
    email: string;
    logo: string;
    nit: string;
    id: string;
  } | null;
}

/** Section that shows the header with the main client information */
export const ClientHeaderSection = ({ clientData }: ClientHeaderSectionProps) => {
  if (!clientData) return null
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={clientData.logo || "/placeholder.svg"}
              alt={`Logo de ${clientData.nombre}`}
              className="rounded-lg border"
              height={80}
              width={80}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <CardTitle className="text-2xl">{clientData.nombre}</CardTitle>
            </div>
            <CardDescription className="text-base mb-4">Cliente de Mantenimiento Biomédico</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex col-span-1 items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">NIT: {clientData.nit}</span>
              </div>
              <div className="flex col-span-2 items-center gap-2">
                <MailLock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.email}</span>
              </div>
              <div className="flex col-span-1 items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.telefono}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default ClientHeaderSection