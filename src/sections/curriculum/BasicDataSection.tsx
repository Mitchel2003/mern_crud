import { ThemeContextProps } from '@/interfaces/context.interface'
import { useCurriculumForm } from '@/hooks/auth/useFormatForm'
import HeaderCustom from '#/common/elements/HeaderCustom'
import CardIterable from '#/common/fields/CardIterable'
import ItemPhoto from '#/pages/curriculum/ItemPhoto'
import InputField from '#/common/fields/Input'
import ImageField from '#/common/fields/Image'

interface BasicDataProps extends ThemeContextProps { }

const BasicDataSection = ({ theme }: BasicDataProps) => {
  const { basicData: files, id } = useCurriculumForm()

  return (
    <div className="space-y-6">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        iconSpan="info"
        title="Información General"
        className="text-2xl font-light"
        span="Propocione los datos basicos del equipo"
      />

      {/* -------------------- Basic data -------------------- */}
      <div className="grid gap-6 md:grid-cols-5">
        <div className="grid gap-4 md:col-span-5 md:grid-cols-2">
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
            name="modelEquip"
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

        <div className="md:col-span-5">
          {/* preview of the image */}
          {files && <ItemPhoto theme={theme} image={files[0]} id={id as string} />}

          {/* input of the image */}
          <CardIterable
            theme={theme}
            name="photoUrl"
            fields={fields({ theme })}
            titleButton="Agregar imagen"
            limit={1 - (files?.length ?? 0)}
          />
        </div>
      </div>
    </div>
  )
}

export default BasicDataSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fields = ({ theme }: ThemeContextProps) => [{
  name: "file",
  component: (
    <ImageField
      name="file"
      theme={theme}
      sizeImage="w-60 h-60"
      label="Imagen del equipo"
    />
  )
}]