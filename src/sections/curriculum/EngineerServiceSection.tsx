import HeaderCustom from '#/common/elements/HeaderCustom'
import InputField from '#/common/fields/Input'

import { ThemeContextProps } from '@/interfaces/context.interface'

interface EngineerServiceProps extends ThemeContextProps { }

const EngineerServiceSection = ({ theme }: EngineerServiceProps) => (
  <div className="space-y-6">
    {/* -------------------- Header -------------------- */}
    <HeaderCustom
      to="component"
      theme={theme}
      title="Ingeniero de Servicio"
      className='text-2xl font-bold'
      span="Ingeniero asociado a la creacion del formato"
      iconSpan="info"
    />

    {/* -------------------- Engineer service -------------------- */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="grid grid-cols-1 gap-2 col-span-1">
        <InputField
          theme={theme}
          name="service_engineer"
          label="Ingeniero de Servicio"
          placeholder="Ingeniero responsable"
        />
        <InputField
          theme={theme}
          name="invima_registration"
          label="Registro INVIMA"
          placeholder="Ingrese el registro asociado"
        />
      </div>
    </div>
  </div>
)

export default EngineerServiceSection