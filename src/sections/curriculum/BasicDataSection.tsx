import HeaderCustom from '#/common/elements/HeaderCustom'
import InputField from '#/common/fields/Input'
import ImageField from '#/common/fields/Image'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { useForm, FormProvider } from 'react-hook-form'

interface BasicDataProps extends ThemeContextProps { }

const BasicDataSection = ({ theme }: BasicDataProps) => {
  const methods = useForm<BasicDataProps>();

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* -------------------- Header -------------------- */}
        <HeaderCustom
          to="component"
          theme={theme}
          title="Información General"
          className="text-2xl font-bold"
          span="Propocione los datos basicos del equipo"
          iconSpan="info"
        />

        {/* -------------------- Basic data -------------------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-8">
          <div className="md:col-span-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* input of 2 columns */}
              <div className="md:col-span-2">
                <InputField
                  name="name"
                  label="Nombre"
                  theme={theme}
                  placeholder="Nombre del equipo"
                />
              </div>
              <InputField
                name="brand"
                label="Marca"
                theme={theme}
                placeholder="Marca del equipo"
              />
              <InputField
                name="model"
                label="Modelo"
                theme={theme}
                placeholder="Modelo del equipo"
              />
              <InputField
                name="serie"
                label="Serie"
                theme={theme}
                placeholder="Número de serie"
              />
              <InputField
                name="healthRecord"
                label="Registro Sanitario"
                theme={theme}
                placeholder="Número de registro sanitario"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <ImageField
              theme={theme}
              name="equipmentImage"
              label="Imagen del Equipo"
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default BasicDataSection