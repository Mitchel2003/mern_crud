import HeaderCustom from '#/curriculum/reusables/HeaderCustom'
import ImageField from '#/curriculum/fields/Image'
import InputField from '#/curriculum/fields/Input'
import { useForm, FormProvider } from 'react-hook-form'

type Image = string | null
type BasicDataProps = {
  name: string;
  brand: string;
  model: string;
  serie: string;
  healthRecord: string;
  equipmentImage: Image;
}

const BasicDataSection = () => {
  const methods = useForm<BasicDataProps>();

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">

        <HeaderCustom
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