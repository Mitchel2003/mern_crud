import HeaderCustom from "#/common/elements/HeaderCustom"
import StatusCheck from "#/common/fields/StatusCheck"
import DateField from "#/common/fields/Date"
import AreaField from "#/common/fields/Area"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/props.interface"
import { Check, X, Clock } from "lucide-react"

const statusOptions: CheckProps[] = [
  { name: 'bueno', label: 'Buen estado', color: 'green', icon: Check },
  { name: 'pendiente', label: 'En espera de repuestos', color: 'yellow', icon: Clock },
  { name: 'inactivo', label: 'Fuera de servicio', color: 'red', icon: X },
]

interface ObservationSectionProps extends ThemeContextProps { }
const ObservationSection = ({ theme }: ObservationSectionProps) => {
  return (
    <div className="space-y-4">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Observaciones"
        className="text-2xl font-light"
        span="Detalles de la revisión"
        iconSpan="info"
      />

      <div className="grid grid-cols-1 gap-6">
        {/* -------------------- Description -------------------- */}
        <AreaField
          theme={theme}
          name="observations"
          label="Descripción"
          placeholder="Describa la rutina del mantenimiento"
          span="Informe sobre actividades u observaciones realizadas"
          iconSpan="none"
        />
        {/* -------------------- Status equipment -------------------- */}
        <StatusCheck
          theme={theme}
          options={statusOptions}
          name="statusEquipment"
          label="Estado del equipo"
          span="Indique la disponibilidad del equipo"
          iconSpan="warn"
        />

        {/* -------------------- Current date and next maintenance -------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField
            theme={theme}
            name="dateMaintenance"
            label="Fecha de mantenimiento"
            placeholder="Seleccione la fecha"
          />
          <DateField
            theme={theme}
            name="dateNextMaintenance"
            label="Fecha próximo mantenimiento"
            placeholder="Seleccione la fecha"
          />
        </div>
      </div>
    </div>
  )
}

export default ObservationSection