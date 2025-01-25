import HeaderCustom from "#/common/elements/HeaderCustom"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import InspectionCV from '@/hooks/format/curriculum/useInspectionCV'
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from "@/hooks/auth/useFormatForm"
import { DialogField } from "@/interfaces/props.interface"
import { useFormUtils } from '@/hooks/core/useFormUtils'

interface PresetInspectionProps extends ThemeContextProps { }

const PresetInspectionSection = ({ theme }: PresetInspectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { hasErrors, isDirtyField, ConfirmTrigger } = useFormUtils()
  const { inspectionData: options } = useCurriculumForm()
  const { onSubmit } = InspectionCV.useInspection()

  return (
    <>
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
            options={options.inspections}
            placeholder="Seleccione una configuración"
            label="Lista de configuraciones preestablecidas"
            span="¿No encuentras lo que buscas? - Puedes agregar una configuración"
            iconSpan="info"
          />

          <CardIterable
            theme={theme}
            name="newInspection"
            titleButton="Nueva inspección"
            fields={inspectionFields({ theme })}
            disabled={!isDirtyField('newInspection', ['name', 'typeInspection']) || hasErrors('newInspection')}
            onSubmit={() => ConfirmTrigger({
              resetData: { name: '', typeInspection: [] },
              description: '¿Deseas añadir una inspección?',
              title: 'Agregar inspección',
              fieldName: 'newInspection',
              onSubmit
            })}
          />
        </div>
      </div>

      <AlertDialog
        open={show}
        theme={theme}
        title={title}
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onOpenChange={setShow}
        description={description}
        onConfirm={handleConfirm}
        variant={isDestructive ? "destructive" : "default"}
      />
    </>
  )
}

export default PresetInspectionSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const inspectionFields = ({ theme }: ThemeContextProps): DialogField[] => {
  return [{
    name: "newInspection.name",
    component:
      <InputField
        name="name"
        theme={theme}
        label="Nombre de la configuración"
        placeholder="Digite un nombre distintivo"
      />
  }, {
    name: "newInspection.typeInspection",
    component:
      <CheckboxField
        theme={theme}
        isMultiple={true}
        name="typeInspection"
        label='Lista de inspecciones'
        options={inspectionOptions}
      />
  }]
}

const inspectionOptions = [
  "Pedal", "Reles", "On/off", "Agujas", "Teclado", "Jeringas", "Sensores", "Pantalla", "Objetivos", "Aperturas",
  "Inspección física", "Manómetro", "Líneas de reactivos", "Manómetros", "Pieza de alta", "Transductores", "Jeringa triple",
  "Instrumentos del equipo", "Líneas de desecho", "Prueba de baterías", "Pruebas de seguridad", "Pruebas de funcionamiento",
  "Revisión y ajustes hidráulicos", "Revisión y ajustes eléctricos", "Revisión y ajustes mecánicos", "Revisión y ajustes neumáticos",
  "Cámaras de wbc/rbc", "Desempeño del equipo", "Revoluciones y/o velocidad", "Ventilación de fuga a tierra",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura"
]