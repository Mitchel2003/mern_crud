import HeaderCustom from "#/common/elements/HeaderCustom"
import CardIterable from "#/common/fields/CardIterable"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"

import { useDialogConfirmContext as useDialogConfirm } from "@/context/DialogConfirmContext"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useInspectionCV } from "@/hooks/auth/useFormatForm"
import { DialogField } from "@/interfaces/props.interface"

interface PresetInspectionProps extends ThemeContextProps { }
const PresetInspectionSection = ({ theme }: PresetInspectionProps) => {
  // const { inspectionData: options } = useCurriculumForm()

  return (
    <div className="space-y-6">
      <HeaderCustom
        to="component"
        theme={theme}
        title="Inspección"
        className="text-2xl font-light"
        span="Establece las inspecciones correspondientes a este equipo"
        iconSpan="warn"
      />

      <div className="grid grid-cols-1 gap-4">
        <SelectField
          theme={theme}
          name="inspection"
          label="Lista de configuraciones preestablecidas"
          placeholder="Seleccione una configuración"
          options={[]}
          //span
          span="¿No encuentras lo que buscas? - Puedes agregar una configuración"
          iconSpan="info"
        />

        <CardIterable
          theme={theme}
          name="inspection"
          fields={inspectionFields({ theme })}
          titleButton="Agregar configuración"
        />
      </div>
    </div>
  )
}

export default PresetInspectionSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Campos del formulario
const inspectionFields = ({ theme }: ThemeContextProps): DialogField[] => {
  const { handleSubmit } = useInspectionCV.useInspection()
  const { confirmAction } = useDialogConfirm()
  return [
    {
      name: "name",
      component:
        <InputField
          theme={theme}
          name="name"
          label="Nombre de la configuración"
          placeholder="Digite un nombre distintivo"
        />
    },
    {
      name: "typeInspection",
      component:
        <CheckboxField
          theme={theme}
          isMultiple={true}
          name="typeInspection"
          label='Lista de inspecciones'
          options={inspectionOptions}
        />
    }
  ]
}

const inspectionOptions = [
  "Pedal", "Reles", "On/off", "Agujas", "Teclado", "Jeringas", "Sensores", "Pantalla", "Objetivos", "Aperturas",
  "Inspección física", "Manómetro", "Líneas de reactivos", "Manómetros", "Pieza de alta", "Transductores", "Jeringa triple",
  "Instrumentos del equipo", "Líneas de desecho", "Prueba de baterías", "Pruebas de seguridad", "Pruebas de funcionamiento",
  "Revisión y ajustes hidráulicos", "Revisión y ajustes eléctricos", "Revisión y ajustes mecánicos", "Revisión y ajustes neumáticos",
  "Sensores", "Cámaras de wbc/rbc", "Desempeño del equipo", "Revoluciones y/o velocidad", "Ventilación de fuga a tierra",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura"
]