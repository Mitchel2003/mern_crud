import HeaderCustom from "#/reusables/elements/HeaderCustom"
import CheckboxField from "#/reusables/fields/Checkbox"
import SelectField from "#/reusables/fields/Select"
import IterableCard from "#/reusables/fields/Card"
import InputField from "#/reusables/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { CardFieldProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"

const inspectionOptions = [
  "Pedal", "Reles", "On/off", "Agujas", "Teclado", "Jeringas", "Sensores", "Pantalla", "Objetivos", "Aperturas",
  "Inspección física", "Manómetro", "Líneas de reactivos", "Manómetros", "Pieza de alta", "Transductores", "Jeringa triple",
  "Instrumentos del equipo", "Líneas de desecho", "Prueba de baterías", "Pruebas de seguridad", "Pruebas de funcionamiento",
  "Revisión y ajustes hidráulicos", "Revisión y ajustes eléctricos", "Revisión y ajustes mecánicos", "Revisión y ajustes neumáticos",
  "Sensores", "Cámaras de wbc/rbc", "Desempeño del equipo", "Revoluciones y/o velocidad", "Ventilación de fuga a tierra",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura"
]

interface PresetInspectionProps extends ThemeContextProps { }
const PresetInspectionSection = ({ theme }: PresetInspectionProps) => {
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
          span="Establece las inspecciones correspondientes a este equipo"
          iconSpan="warn"
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
            span="¿No encuentras lo que buscas? - Puedes agregar una configuración"
            iconSpan="info"
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

export default PresetInspectionSection