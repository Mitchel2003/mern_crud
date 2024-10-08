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
      name: "name_inspection",
      component:
        <InputField
          theme={theme}
          name="name_inspection"
          label="Nombre de la configuración"
          control={methods.control}
          placeholder="Digite un nombre distintivo"
        />
    },
    {
      name: "inspection",
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
          iconSpan="warn"
          span="Establece las inspecciones correspondientes a este equipo"
        />

        <div className="grid grid-cols-1 gap-4">
          <SelectField
            theme={theme}
            name="inspectionPreset"
            label="Lista de configuraciones preestablecidas"
            control={methods.control}
            options={['N/A']}
            placeholder="Seleccione una configuración"
            //span
            iconSpan="info"
            span="¿No encuentras lo que buscas? - Puedes agregar una configuración"
          />

          <IterableCard
            theme={theme}
            name="inspection"
            fields={inspectionFields}
            control={methods.control}
            titleButton="Agregar configuración"
          />
        </div>
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