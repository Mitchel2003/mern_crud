import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface EquipmentProps extends ThemeContextProps { }
const ReferenceEquipmentSection = ({ theme }: EquipmentProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="component"
          theme={theme}
          title="Referencia al equipo"
          className="text-2xl font-bold"
          span={'Equipo asociado al formato'}
          iconSpan='warn'
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SelectField
            theme={theme}
            name="equipment"
            label="Equipo para mantenimiento"
            placeholder="Seleccionar el equipo"
            options={[
              { label: 'Compac Q - servicio recepcion - salon 12 - odontologia', value: 'compac_q' },
              { label: 'Taladro metalico - servicio dental - salon 12 - odontologia', value: 'taladro_metalico' }
            ]}
          />

          <InputField
            theme={theme}
            name="service"
            label="Servicio"
            placeholder="Servicio del equipo"
          />

          <InputField
            theme={theme}
            name="address"
            label="Ubicación"
            placeholder="Ubicación del equipo"
          />
        </div>
      </div>
    </FormProvider>
  )
}

export default ReferenceEquipmentSection