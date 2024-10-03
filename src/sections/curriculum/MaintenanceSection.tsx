import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import CheckboxField from "#/curriculum/fields/Checkbox"
import SelectField from "#/curriculum/fields/Select"
import { FormProvider, useForm } from "react-hook-form"

type MaintenanceProps = {
  maintenance: string;
  type_maintenance: string[];
  frequency_maintenance: string;
  manual: string[];
}

const MaintenanceSection = () => {
  const methods = useForm<MaintenanceProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        <HeaderCustom
          to="section"
          title="Mantenimiento"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            name="maintenance"
            control={methods.control}
            label="Mantenimiento"
            placeholder="Seleccionar tipo"
            options={['Propio', 'Contratado']}
          />
          <CheckboxField
            isMultiple={true}
            label="Tipo de Mantenimiento"
            control={methods.control}
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
            label="Manuales"
            control={methods.control}
            options={['servicio', 'componentes', 'usuario', 'despiece']}
          />
        </div>

      </div>
    </FormProvider>
  )
}

export default MaintenanceSection