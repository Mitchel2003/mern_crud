import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import ImagePreview from "#/common/elements/ImagePreview"
import InputField from "#/common/fields/Input"

import { FormProvider, useForm } from "react-hook-form"

interface EngineerServiceSectionProps extends ThemeContextProps { }

const EngineerServiceSection = ({ theme }: EngineerServiceSectionProps) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          title="Ingeniero de servicio"
          className="text-2xl font-bold"
          span="Firmas y recibido"
          iconSpan="info"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* -------------------- Engineer Info -------------------- */}
          <div className="space-y-4">
            <InputField
              theme={theme}
              name="engineerName"
              label="Nombre del ingeniero"
              placeholder="Ingrese el nombre completo"
            />
            <InputField
              theme={theme}
              name="invimaRegistration"
              label="Registro INVIMA"
              placeholder="Ingrese el número de registro"
            />
          </div>

          {/* -------------------- Signatures -------------------- */}
          <div className="space-y-4">
            <InputField
              theme={theme}
              name="satisfactionReceived"
              label="Recibido a satisfacción"
              placeholder="Nombre de quien recibe"
            />
            <InputField
              theme={theme}
              name="engineerSignature"
              label="Firma del ingeniero"
              placeholder="Firma digital o iniciales"
            />
          </div>

          {/* -------------------- Company Logo -------------------- */}
          <ImagePreview
          theme={theme}
          name="ImageEngineerService"
          control={methods.control}
          label="logo ingeniero"
          />

        </div>
      </div>
    </FormProvider>
  )
}

export default EngineerServiceSection