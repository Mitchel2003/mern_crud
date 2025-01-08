import HeaderCustom from "#/common/elements/HeaderCustom"
import IterableCard from "#/common/fields/CardIterable"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface PresetInspectionProps extends ThemeContextProps { }
const PresetInspectionSection = ({ theme }: PresetInspectionProps) => {
  const methods = useForm()

  const inspectionFields = [
    {
      name: "name_inspection",
      component:
        <InputField
          theme={theme}
          name="name_inspection"
          label="Nombre de la configuración"
          placeholder="Digite un nombre distintivo"
        />
    },
    {
      name: "inspection",
      component:
        <div className="mt-4">
          <CheckboxField
            theme={theme}
            name="inspection"
            isMultiple={true}
            label='Lista de inspecciones'
            options={inspectionOptions}
          />
        </div>
    }
  ]

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <HeaderCustom
          to="component"
          theme={theme}
          title="Inspección"
          className="text-2xl font-bold"
          span="Establece las inspecciones correspondientes a este equipo"
          iconSpan="warn"
        />

        <div className="grid grid-cols-1 gap-4">
          <SelectField
            theme={theme}
            name="inspectionPreset"
            label="Lista de configuraciones preestablecidas"
            placeholder="Seleccione una configuración"
            options={[{ label: "N/A", value: "na" }]}
            //span
            span="¿No encuentras lo que buscas? - Puedes agregar una configuración"
            iconSpan="info"
          />

          <IterableCard
            theme={theme}
            name="inspection"
            fields={inspectionFields}
            titleButton="Agregar configuración"
          />
        </div>
      </div>
    </FormProvider>
  )
}

export default PresetInspectionSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const inspectionOptions = [
  "Pedal", "Reles", "On/off", "Agujas", "Teclado", "Jeringas", "Sensores", "Pantalla", "Objetivos", "Aperturas",
  "Inspección física", "Manómetro", "Líneas de reactivos", "Manómetros", "Pieza de alta", "Transductores", "Jeringa triple",
  "Instrumentos del equipo", "Líneas de desecho", "Prueba de baterías", "Pruebas de seguridad", "Pruebas de funcionamiento",
  "Revisión y ajustes hidráulicos", "Revisión y ajustes eléctricos", "Revisión y ajustes mecánicos", "Revisión y ajustes neumáticos",
  "Sensores", "Cámaras de wbc/rbc", "Desempeño del equipo", "Revoluciones y/o velocidad", "Ventilación de fuga a tierra",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura"
]