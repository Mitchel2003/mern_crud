import HeaderCustom from "#/common/elements/HeaderCustom"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { ConfirmTriggerProps, DialogField } from "@/interfaces/props.interface"
import InspectionCV from '@/hooks/format/curriculum/useInspectionCV'
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCurriculumForm } from "@/hooks/auth/useFormatForm"
import { useFormContext } from "react-hook-form"

interface PresetInspectionProps extends ThemeContextProps { }

const PresetInspectionSection = ({ theme }: PresetInspectionProps) => {
  const { show, setShow, handleConfirm, confirmAction, title, description, isDestructive } = useDialogConfirm()
  const { getValues, setValue, trigger, formState: { dirtyFields, errors } } = useFormContext()
  const { inspectionData: options } = useCurriculumForm()
  const { onSubmit } = InspectionCV.useInspection()

  /**
   * Función para verificar si hay errores en un campo, esto nos ayuda a manejar el "disabled" en el formulario
   * @param fieldName - Nombre del campo, corresponde a cualquier campo del schema de curriculum
   */
  const hasErrors = (fieldName: string) => !!errors[fieldName]

  /**
   * Función para verificar si hay cambios en un campo del formulario, esto nos ayuda a manejar el "disabled" en el formulario
   * @param fieldName - Nombre del campo que se va a verificar, en este caso es inspeccion.
   */
  const isDirtyInspection = (fieldName: string) => {
    const fields = dirtyFields[fieldName] as Record<string, boolean>[]
    return fields?.[0]?.name && fields[0]?.typeInspection
  }

  /**
   * Nos permite confirmar la accion de guardar
   * @param {ConfirmTriggerProps} param
   */
  const ConfirmTrigger = async ({ onSubmit, resetData, description, fieldName, title }: ConfirmTriggerProps) => {
    const isValid = await trigger(fieldName)
    const action = async () => { await onSubmit(getValues(fieldName)[0]); setValue(fieldName, [resetData]) }
    isValid && confirmAction({ title, description, action })
  }

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
            disabled={!isDirtyInspection('newInspection') || hasErrors('newInspection')}
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
  "Sensores", "Cámaras de wbc/rbc", "Desempeño del equipo", "Revoluciones y/o velocidad", "Ventilación de fuga a tierra",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura"
]