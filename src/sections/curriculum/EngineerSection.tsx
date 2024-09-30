import LogoField from '#/curriculum/LogoImageField'
import InputField from '#/curriculum/Field'

import { EngineerProps } from '@/interfaces/form.interface'
import { useForm } from 'react-hook-form'

const EngineerSection = () => {
  const form = useForm<EngineerProps>()

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Referencia del Ingeniero Encargado</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
        <LogoField
          name="engineer_image"
          control={form.control}
          label="Imagen del Ingeniero"
        />
      </div>
    </div>
  )
}

export default EngineerSection