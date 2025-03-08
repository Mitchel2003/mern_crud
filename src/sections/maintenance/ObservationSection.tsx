import HeaderCustom from "#/common/elements/HeaderCustom"
import StatusCheck from "#/common/fields/StatusCheck"
import CalendarField from "#/common/fields/Calendar"
import SelectField from "#/common/fields/Select"
import AreaField from "#/common/fields/Area"

import { typeMaintenanceCollection as typesMaintenance } from "@/utils/constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/props.interface"
import { useFormContext } from "react-hook-form"
import { Check, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ObservationSectionProps extends ThemeContextProps { }
const ObservationSection = ({ theme }: ObservationSectionProps) => {
  const selectedMT = useFormContext().watch('typeMaintenance')
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
        <div className={cn('grid gap-4', selectedMT === 'preventivo' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
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
          {selectedMT === 'preventivo' && (
            <CalendarField
              theme={theme}
              toYear={2030}
              fromYear={1950}
              name="dateNextMaintenance"
              label="Fecha próximo mantenimiento"
              placeholder="Seleccionar fecha"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ObservationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const statusOptions: CheckProps[] = [
  { name: 'funcionando', label: 'Funcionando', color: 'green', icon: Check },
  { name: 'en espera de repuestos', label: 'En espera de repuestos', color: 'yellow', icon: Clock },
  { name: 'fuera de servicio', label: 'Fuera de servicio', color: 'red', icon: X },
]