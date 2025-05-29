import { Building2, Stethoscope, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsSectionProps {
  clientData: {
    sedes: {
      consultorios: {
        equipos: any[];
      }[];
    }[]
  } | null;
}

/** Section that shows quick statistics about the client */
export const StatsSection = ({ clientData }: StatsSectionProps) => {
  if (!clientData) return null
  const totalSedes = clientData.sedes.length
  const totalConsultorios = clientData.sedes.reduce(
    (total, sede) => total + sede.consultorios.length,
    0
  )

  const totalEquipos = clientData.sedes.reduce(
    (total, sede) =>
      total + sede.consultorios.reduce(
        (sedeTotal, consultorio) => sedeTotal + consultorio.equipos.length,
        0
      ),
    0
  )
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{totalSedes}</p>
              <p className="text-sm text-muted-foreground">Sedes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{totalConsultorios}</p>
              <p className="text-sm text-muted-foreground">Consultorios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{totalEquipos}</p>
              <p className="text-sm text-muted-foreground">Equipos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsSection