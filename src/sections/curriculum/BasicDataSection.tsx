import HeaderText from '#/curriculum/reusables/HeaderText'
import ImageField from '#/curriculum/fields/Image'
import InputField from '#/curriculum/fields/Input'

import { GeneralDataProps } from '@/interfaces/form.interface'
import { useForm, FormProvider } from 'react-hook-form'

const BasicDataSection = () => {
  const methods = useForm<GeneralDataProps>();

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        <HeaderText
          to="section"
          icon="info"
          title="Información General"
          description="Propocione los datos basicos del equipo"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-8">

          <div className="md:col-span-5">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

              {/* input of 2 columns */}
              <div className="md:col-span-2">
                <InputField
                  name="name"
                  label="Nombre"
                  control={methods.control}
                  placeholder="Nombre del equipo"
                />
              </div>
              <InputField
                name="brand"
                label="Marca"
                control={methods.control}
                placeholder="Marca del equipo"
              />
              <InputField
                name="model"
                label="Modelo"
                control={methods.control}
                placeholder="Modelo del equipo"
              />
              <InputField
                name="serie"
                label="Serie"
                control={methods.control}
                placeholder="Número de serie"
              />
              <InputField
                name="healthRecord"
                label="Registro Sanitario"
                control={methods.control}
                placeholder="Número de registro sanitario"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <ImageField
              name="equipmentImage"
              label="Imagen del Equipo"
              control={methods.control}
            />
          </div>

        </div>
      </div>
    </FormProvider>
  )
}

export default BasicDataSection