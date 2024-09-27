import CheckboxField from "@/components/curriculum/CheckboxField";

import { EquipmentProps } from "@/interfaces/form.interface";
import SelectField from "@/components/curriculum/SelectField";
import { FormProvider, useForm } from "react-hook-form";

const EquipmentSection = () => {
  const methods = useForm<EquipmentProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        {/* Classification */}
        <h3 className="text-2xl font-bold">Clasificación del Equipo</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="col-span-8">
            <CheckboxField
              name="technology_predominant"
              control={methods.control}
              label="Tecnología Predominante"
              options={['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico']}
            />
          </div>
          <div className="col-span-4">
            <SelectField
              name="risk"
              control={methods.control}
              label="Riesgo"
              placeholder="Seleccionar riesgo"
              options={['muy_alto', 'alto', 'moderado', 'bajo']}
            />
          </div>
        </div>

      </div>
    </FormProvider >
  )
}

export default EquipmentSection