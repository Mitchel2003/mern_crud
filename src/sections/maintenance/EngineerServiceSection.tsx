import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import InputField from "#/common/fields/Input"

interface EngineerServiceSectionProps extends ThemeContextProps { }

const EngineerServiceSection = ({ theme }: EngineerServiceSectionProps) => {
  return (
    <div className="space-y-4">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        title="Ingeniero de servicio"
        className="text-2xl font-light"
        span="Firmas y recibido"
        iconSpan="info"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* -------------------- Engineer Info -------------------- */}
        <InputField
          theme={theme}
          name="nameEngineer"
          label="Nombre del ingeniero"
          placeholder="Ingrese el nombre completo"
        />
        <InputField
          theme={theme}
          name="invimaEngineer"
          label="Registro INVIMA"
          placeholder="Ingrese el número de registro"
        />
        <InputField
          theme={theme}
          name="receivedBy"
          label="Recibido a satisfacción"
          placeholder="Nombre de quien recibe"
        />
      </div>
    </div>
  )
}

export default EngineerServiceSection