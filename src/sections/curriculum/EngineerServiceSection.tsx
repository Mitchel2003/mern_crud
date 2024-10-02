import HeaderText from '#/curriculum/reusables/HeaderText'
import LogoImage from '#/curriculum/reusables/LogoImage'
import InputField from '#/curriculum/fields/Input'

import { EngineerProps } from '@/interfaces/form.interface'
import { useForm } from 'react-hook-form'

const EngineerServiceSection = () => {
  const form = useForm<EngineerProps>()

  return (
    <div className="space-y-6">

      <HeaderText
        to="section"
        icon="info"
        title="Ingeniero de Servicio"
        description="Ingeniero y entidad asociada"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div className="grid grid-cols-1 gap-2 col-span-1">
          <InputField
            name="service_engineer"
            label="Ingeniero de Servicio"
            control={form.control}
            placeholder="Ingeniero responsable"
          />
          <InputField
            name="invima_registration"
            label="Registro INVIMA"
            control={form.control}
            placeholder="Ingrese el registro asociado"
          />
        </div>

        <LogoImage
          name="logo_headquarter"
          control={form.control}
        />
      </div>
    </div>
  )
}

export default EngineerServiceSection