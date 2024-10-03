import HeaderText from "#/curriculum/reusables/HeaderText"
import CheckboxField from "#/curriculum/fields/Checkbox"
import SelectField from "#/curriculum/fields/Select"

import { EquipmentProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"

const EquipmentClassificationSection = () => {
  const methods = useForm<EquipmentProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        {/* Classification */}
        <HeaderText
          to="section"
          icon="warn"
          title="Clasificación del Equipo"
          description="Informacion sensible"
        />

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <SelectField
            name="type_device"
            control={methods.control}
            label="Tipo"
            placeholder="Seleccionar tipo"
            options={['fijo', 'movil']}
          />
          <SelectField
            name="classification_by_use"
            control={methods.control}
            label="Clasificación por Uso"
            placeholder="Seleccionar clasificación"
            options={['medico', 'basico', 'apoyo']}
          />
          <SelectField
            name="classification_biomedical"
            control={methods.control}
            label="Clasificación Biomédica"
            placeholder="Seleccionar clasificación"
            options={['diagnostico', 'tratamiento', 'prevencion', 'rehabilitacion', 'analisis']}
          />
        </div>

        {/* technology and risk*/}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
          <div className="col-span-4">
            <SelectField
              name="risk"
              control={methods.control}
              label="Riesgo"
              placeholder="Seleccionar riesgo"
              options={['muy_alto', 'alto', 'moderado', 'bajo']}
            />
          </div>
          <div className="col-span-8">
            <CheckboxField
              isMultiple={true}
              label="Tecnología Predominante"
              control={methods.control}
              options={['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico']}
            />
          </div>
        </div>

      </div>
    </FormProvider >
  )
}

export default EquipmentClassificationSection