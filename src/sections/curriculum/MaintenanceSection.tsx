import CheckboxField from "#/curriculum/CheckboxField";
import SelectField from "#/curriculum/SelectField";

import { MaintenanceProps } from "@/interfaces/form.interface";
import { FormProvider, useForm } from "react-hook-form";

const MaintenanceSection = () => {
  const methods = useForm<MaintenanceProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        <h3 className="text-2xl font-bold">Mantenimiento</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            name="maintenance"
            control={methods.control}
            label="Mantenimiento"
            placeholder="Seleccionar tipo"
            options={['Propio', 'Contratado']}
          />
          <CheckboxField
            name="type_maintenance"
            control={methods.control}
            label="Tipo de Mantenimiento"
            options={['Preventivo', 'Correctivo', 'Predictivo']}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            name="frequency_maintenance"
            control={methods.control}
            label="Frecuencia de Mantenimiento"
            placeholder="Seleccionar frecuencia"
            options={['3 meses', '4 meses', '6 meses', '12 meses']}
          />
          <CheckboxField
            name="manual"
            control={methods.control}
            label="Manuales"
            options={['servicio', 'componentes', 'usuario', 'despiece']}
          />
        </div>

      </div>
    </FormProvider>
  )
}

export default MaintenanceSection