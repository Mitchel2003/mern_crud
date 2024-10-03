import HeaderCustom from '#/curriculum/reusables/HeaderCustom'
import LogoImage from '#/curriculum/reusables/LogoImage'
import InputField from '#/curriculum/fields/Input'
import { useForm } from 'react-hook-form'

type Image = string | null
type EngineerProps = {
  service_engineer: string;
  invima_registration: string;
  engineer_image: Image;
}

const EngineerServiceSection = () => {
  const form = useForm<EngineerProps>()

  return (
    <div className="space-y-6">

      <HeaderCustom
        to="section"
        icon="info"
        title="Ingeniero de Servicio"
        description="Logotipo de la entidad asociada"
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