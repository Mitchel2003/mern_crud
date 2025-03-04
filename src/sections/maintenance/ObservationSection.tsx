import HeaderCustom from "#/common/elements/HeaderCustom"
import StatusCheck from "#/common/fields/StatusCheck"
import SelectField from "#/common/fields/Select"
import AreaField from "#/common/fields/Area"

import { typeMaintenanceCollection as typesMaintenance } from "@/utils/constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/props.interface"
import { Check, X, Clock } from "lucide-react"
import CalendarField from "@/components/common/fields/Calendar"

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            theme={theme}
            name="typeMaintenance"
            label="Tipo de mantenimiento"
            placeholder="Seleccionar tipo de mantenimiento"
            options={typesMaintenance.filter(mt => mt !== 'predictivo').map(mt => ({ label: mt, value: mt }))}
          />
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            name="dateMaintenance"
            label="Fecha mantenimiento"
            placeholder="Seleccione la fecha"
          />
          <CalendarField
            theme={theme}
            toYear={2030}
            fromYear={1950}
            name="dateNextMaintenance"
            label="Fecha próximo mantenimiento"
            placeholder="Seleccionar fecha"
          />
        </div>
      </div>
    </div>
  )
}

export default ObservationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const statusOptions: CheckProps[] = [
  { name: 'bueno', label: 'Buen estado', color: 'green', icon: Check },
  { name: 'pendiente', label: 'En espera de repuestos', color: 'yellow', icon: Clock },
  { name: 'inactivo', label: 'Fuera de servicio', color: 'red', icon: X },
]