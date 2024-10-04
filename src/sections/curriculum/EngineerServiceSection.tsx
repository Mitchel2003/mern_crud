import HeaderCustom from '#/curriculum/reusables/HeaderCustom'
import LogoImage from '#/curriculum/reusables/LogoImage'
import InputField from '#/curriculum/fields/Input'
import { useForm } from 'react-hook-form'

import { ThemeContextProps } from '@/interfaces/context.interface'

interface EngineerServiceProps extends ThemeContextProps { }

const EngineerServiceSection = ({ theme }: EngineerServiceProps) => {
  const form = useForm<EngineerServiceProps>()

  return (
    <div className="space-y-6">

      <HeaderCustom
        theme={theme}
        to="section"
        icon="info"
        title="Ingeniero de Servicio"
        description="Logotipo de la entidad asociada"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div className="grid grid-cols-1 gap-2 col-span-1">
          <InputField
            theme={theme}
            name="service_engineer"
            label="Ingeniero de Servicio"
            control={form.control}
            placeholder="Ingeniero responsable"
          />
          <InputField
            theme={theme}
            name="invima_registration"
            label="Registro INVIMA"
            control={form.control}
            placeholder="Ingrese el registro asociado"
          />
        </div>

        <LogoImage
          theme={theme}
          name="logo_headquarter"
          control={form.control}
        />
      </div>
    </div>
  )
}

export default EngineerServiceSection