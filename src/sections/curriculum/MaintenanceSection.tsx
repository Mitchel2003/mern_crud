import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface MaintenanceProps extends ThemeContextProps { }

const MaintenanceSection = ({ theme }: MaintenanceProps) => {
  const methods = useForm<MaintenanceProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          title="Mantenimiento"
          className="text-2xl font-bold"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            theme={theme}
            name="performing_maintenance"
            label="Realización de Mantenimiento"
            placeholder="Seleccionar tipo"
            options={[
              { label: "Propio", value: "own" },
              { label: "Contratado", value: "contracted" }
            ]}
          />
          <CheckboxField
            theme={theme}
            isMultiple={true}
            name="type-maintenance"
            label="Tipo de Mantenimiento"
            options={['Preventivo', 'Correctivo', 'Predictivo']}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            theme={theme}
            name="frequency_maintenance"
            label="Frecuencia de Mantenimiento"
            placeholder="Seleccionar frecuencia"
            options={[
              { label: "3 meses", value: "3" },
              { label: "4 meses", value: "4" },
              { label: "6 meses", value: "6" },
              { label: "12 meses", value: "12" }
            ]}
          />
          <CheckboxField
            theme={theme}
            name="manuales"
            label="Manuales"
            options={['servicio', 'componentes', 'usuario', 'despiece']}
          />
        </div>

      </div>
    </FormProvider>
  )
}

export default MaintenanceSection