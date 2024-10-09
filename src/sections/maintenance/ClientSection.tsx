import ImagePreview from "@/components/reusables/elements/ImagePreview"
import HeaderCustom from "#/reusables/elements/HeaderCustom"
import SelectField from "#/reusables/fields/Select"
import InputField from "#/reusables/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"

interface ClientProps extends ThemeContextProps { }

const ClientSection = ({ theme }: ClientProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="section"
          theme={theme}
          title="Datos del cliente"
          span="Cliente asociado al formato de mantenimiento"
          iconSpan="info"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-8">
          {/* -------------------- Client -------------------- */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-1 gap-4">
              <SelectField
                theme={theme}
                name="client"
                label="Cliente"
                control={methods.control}
                options={['IPS Sanitas', 'EDS Nueva esperanza']}
                placeholder="Selecciona un cliente"
              />
              <InputField
                theme={theme}
                name="contact"
                label="Contacto"
                control={methods.control}
                placeholder="Numero de contacto"
              />
              <InputField
                theme={theme}
                name="address"
                label="Dirección"
                control={methods.control}
                placeholder="Dirección del cliente"
              />
            </div>
          </div>

          {/* -------------------- Logo -------------------- */}
          <div className="md:col-span-3">
            <ImagePreview
              theme={theme}
              name="logo_client"
              control={methods.control}
              label="Logotipo del cliente asociado"
            />
          </div>
        </div>

      </div>
    </FormProvider>
  )
}
export default ClientSection