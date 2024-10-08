import HeaderCustom from "#/reusables/elements/HeaderCustom"
import StatusCheck from "#/reusables/elements/StatusCheck"
import AreaField from "#/reusables/fields/Area"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { OptionsCheckProps } from "@/interfaces/form.interface"
import { useForm, FormProvider } from 'react-hook-form'

interface ObservationSectionProps extends ThemeContextProps { }
const ObservationSection = ({ theme }: ObservationSectionProps) => {
  const methods = useForm()

  const statusOptions: OptionsCheckProps[] = [
    { name: 'good', label: 'Buen estado', color: 'green' },
    { name: 'wait', label: 'En espera de repuestos', color: 'yellow' },
    { name: 'out', label: 'Fuera de servicio', color: 'red' },
  ]

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="section"
          theme={theme}
          title="Observaciones"
          span="Detalles de la revisión"
          iconSpan="info"
        />

        <div className="grid grid-cols-1 gap-6">

          <div className="space-y-2">
            <HeaderCustom
              to="component"
              theme={theme}
              title="Descripción"
              span="Informe sobre actividades u observaciones realizadas"
              iconSpan="none"
            />
            <AreaField
              theme={theme}
              name="description"
              control={methods.control}
              placeholder="Describa la rutina del mantenimiento"
            />
          </div>

          {/* working here... */}
          {/* presta atencion a este componente, la responsividad es perfecta porque como tal
          porque el StatusCheck es el encargado de manejar el comportamiento y asociados, mientras
          que el headerCustom anida el titulo y span respectivamente */}

          {/* lo que digo es: deberia ser este modelo para con todos los componentes reutilizables,
          si miras bien, los componentes se extienden con tipografias como HeaderCustomSpanProps, para
          poder manejar el uso de iconos, colores, etc; convirtiendolo en un componente complejo.
          quizas pueda yo volver un poco mas ligeros los componentes reutilizables */}
          <div className="space-y-2">
            <HeaderCustom
              to="component"
              theme={theme}
              title="Estado del equipo"
              span="Indique la disponibilidad del equipo"
              iconSpan="warn"
            />
            <StatusCheck
              theme={theme}
              name="equipmentStatus"
              control={methods.control}
              options={statusOptions}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default ObservationSection