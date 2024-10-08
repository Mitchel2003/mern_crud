import HeaderCustom from "#/reusables/elements/HeaderCustom"
import CheckboxField from "#/reusables/fields/Checkbox"
import SelectField from "#/reusables/fields/Select"
import IterableCard from "#/reusables/fields/Card"
import InputField from "#/reusables/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { CardFieldProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"

interface InspectionProps extends ThemeContextProps { }
const InspectionSection = ({ theme }: InspectionProps) => {
  const methods = useForm()

  const inspectionFields: CardFieldProps[] = [
    {
      name: "name_preset",
      component: <InputField name="name_preset" label="Nombre del preset" theme={theme} control={methods.control} />
    },
    {
      name: "preset",
      component:
        <div className="mt-4">
          <CheckboxField
            theme={theme}
            isMultiple={true}
            label='Lista de inspecciones'
            control={methods.control}
            options={inspectionOptions}
          />
        </div>
    }
  ]

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="section"
          theme={theme}
          title="Inspección"
          iconSpan="alert"
          span="Establece las inspecciones correspondientes a este equipo"
        />

        <SelectField
          theme={theme}
          name="inspectionPreset"
          label="Lista de configuraciones preestablecidas - presets"
          control={methods.control}
          options={['N/A']}
          placeholder="Seleccione un preset"
        />

        <IterableCard
          theme={theme}
          name="inspection"
          fields={inspectionFields}
          control={methods.control}
          titleButton="Agregar preset"
        />
      </div>
    </FormProvider>
  )
}

export default InspectionSection

const inspectionOptions = [
  "Pedal",
  "Reles",
  "On/off",
  "Agujas",
  "Teclado",
  "Jeringas",
  "Sensores",
  "Pantalla",
  "Objetivos",
  "Aperturas",
  "Revisión y ajustes eléctricos",
  "Revisión y ajustes neumáticos",
  "Verificación de polo a tierra",
  "Revisión y ajustes hidráulicos",
  "Pieza de alta",
  "Transductores",
  "Jeringa triple",
  "Líneas de desecho",
  "Inspeccion fisica",
  "Cámaras de wbc/rbc",
  "Linea de reactivos",
  "Desempeño del equipo",
  "Revoluciones y/o velocidad",
  "Revisión y ajustes mecánicos",
]