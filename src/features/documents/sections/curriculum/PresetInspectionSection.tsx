import InputSearchableField from "#/common/fields/InputSearchable"
import HeaderCustom from "#/common/elements/HeaderCustom"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import CheckboxField from "#/common/fields/Checkbox"
import InputField from "#/common/fields/Input"

import { useDialogConfirmContext as useDialogConfirm } from '@/context/DialogConfirmContext'
import { DialogField, SelectOptionProps } from "@/interfaces/props.interface"
import InspectionCV from '@/hooks/form-handlers/curriculum/useInspectionCV'
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useFormUtils } from '@/hooks/core/useFormUtils'

interface PresetInspectionProps extends ThemeContextProps {
  options: { inspections: SelectOptionProps[] }
}

const PresetInspectionSection = ({ theme, options }: PresetInspectionProps) => {
  const { show, setShow, handleConfirm, title, description, isDestructive } = useDialogConfirm()
  const { hasErrors, isDirtyField, ConfirmTrigger } = useFormUtils()
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
          <InputSearchableField
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
            disabledSubmit={!isDirtyField('newInspection', ['name', 'typeInspection']) || hasErrors('newInspection')}
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
        onOpenChange={setShow}
        confirmLabel="Confirmar"
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
        isMultiple
        theme={theme}
        name="typeInspection"
        label='Lista de inspecciones'
        options={inspectionOptions}
      />
  }]
}

const inspectionOptions = [
  "Pedal", "Reles", "On/off", "Agujas", "Teclado", "Jeringas", "Sensores", "Poleas", "Accesorios", "Motores",
  "Otoscopio", "Pantalla", "Objetivos", "Aperturas", "Electrodos", "Transductores", "Jeringa triple", "Inspección física",
  "Presostato", "Temporizador", "Resistencia", "Manómetros", "Mangeras", "Rodamientos", "Escobillas", "Pieza de alta", "Pieza de baja",
  "Oftalmoscópio", "Celda de flujo", "Baño serológico", "Bomba peristaltica", "Bombilla o lampara", "Cooler/ventilador", "Electro-valvulas",
  "Líneas de desecho", "Linea de agua", "Líneas de reactivos", "Mangera peristaltica", "Cámaras de wbc/rbc", "Ventilación de fuga a tierra",
  "Limpieza general", "Limpieza de sistema optico", "Prueba de baterías", "Pruebas de seguridad", "Pruebas de funcionamiento",
  "Revisión y ajustes hidráulicos", "Revisión y ajustes eléctricos", "Revisión y ajustes mecánicos", "Revisión y ajustes neumáticos", "Revisión de empaques",
  "Verificación de polo a tierra", "Verificación de presión", "Verificación de temperatura", "Verificación de volumen", "Verificación de vacio",
  "Instrumentos del equipo", "Desempeño del equipo", "Rejilla y/o porta objetos", "Ajuste de puertas y/o empaques", "Revoluciones y/o velocidad",
]