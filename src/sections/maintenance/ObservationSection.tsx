import HeaderCustom from "#/reusables/elements/HeaderCustom"
import StatusCheck from "#/reusables/elements/StatusCheck"
import AreaField from "#/reusables/fields/Area"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { CheckProps } from "@/interfaces/form.interface"
import { useForm, FormProvider } from 'react-hook-form'

const statusOptions: CheckProps[] = [
  { name: 'good', label: 'Buen estado', color: 'green' },
  { name: 'wait', label: 'En espera de repuestos', color: 'yellow' },
  { name: 'out', label: 'Fuera de servicio', color: 'red' },
]

interface ObservationSectionProps extends ThemeContextProps { }
const ObservationSection = ({ theme }: ObservationSectionProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="component"
          theme={theme}
          title="Observaciones"
          className="text-2xl font-bold"
          span="Detalles de la revisión"
          iconSpan="info"
        />

        <div className="grid grid-cols-1 gap-6">
          <AreaField
            theme={theme}
            name="description"
            label="Descripción"
            control={methods.control}
            placeholder="Describa la rutina del mantenimiento"
            span="Informe sobre actividades u observaciones realizadas"
            iconSpan="none"
          />
          <StatusCheck
            theme={theme}
            name="equipmentStatus"
            label="Estado del equipo"
            control={methods.control}
            options={statusOptions}
            span="Indique la disponibilidad del equipo"
            iconSpan="warn"
          />
        </div>
      </div>
    </FormProvider>
  )
}

export default ObservationSection