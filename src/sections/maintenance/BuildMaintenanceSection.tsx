import AreaToggleableField from "#/common/fields/AreaToggleable"
import HeaderCustom from "#/common/elements/HeaderCustom"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Separator } from "#/ui/separator"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface BuildMaintenanceProps extends ThemeContextProps { }
const BuildMaintenanceSection = ({ theme }: BuildMaintenanceProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <HeaderCustom
          to="component"
          theme={theme}
          title="Mantenimiento"
          className="text-2xl font-bold"
        />

        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12">

          <div className="md:col-span-6">
            <div className="grid grid-cols-1 items-center gap-2">
              <SelectField
                theme={theme}
                name="tipoMantenimiento"
                label="Tipo de mantenimiento"
                options={[
                  { label: "Preventivo", value: "preventivo" },
                  { label: "Correctivo", value: "correctivo" }
                ]}
                placeholder="Seleccione el tipo de mantenimiento"
                //to span
                span="Obligatorio"
                iconSpan="alert"
              />
              <AreaToggleableField
                theme={theme}
                name="equipmentFault"
                className="min-h-[55px]"
                inputLabel="Descripción"
                label="¿Equipo presenta falla?"
                placeholder="Ingrese los detalles"
              />
            </div>
          </div>

          <div className="md:col-span-1 hidden md:flex justify-center items-center">
            <Separator
              orientation="vertical"
              className={`h-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`}
            />
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-1 items-center gap-2">
              <InputField
                theme={theme}
                name="voltage"
                label="Voltaje"
                placeholder="Indique el voltaje"
                //to span
                span="Coleccion de datos"
                iconSpan="info"
              />
              <InputField
                theme={theme}
                name="power"
                label="Potencia"
                placeholder="Indique la potencia"
              />
              <InputField
                theme={theme}
                name="current"
                label="Corriente"
                placeholder="Indique la corriente electrica"
              />
            </div>
          </div>

        </div>
      </div>
    </FormProvider>
  )
}

export default BuildMaintenanceSection