import InputSearchableField from '#/common/fields/InputSearchable'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { SelectOptionProps } from '@/interfaces/props.interface'
import HeaderCustom from '#/common/elements/HeaderCustom'
import ImagePreview from '#/common/fields/ImagePreview'
import CardIterable from '#/common/fields/CardIterable'
import { useFormContext } from 'react-hook-form'
import InputField from '#/common/fields/Input'
import ImageField from '#/common/fields/Image'
import { cn } from '@/lib/utils'

interface BasicDataProps extends ThemeContextProps {
  options: SelectOptionProps[]
  id: boolean
}

const BasicDataSection = ({ id, theme, options }: BasicDataProps) => {
  const { getValues } = useFormContext()
  return (
    <div className="space-y-6">
      {/* -------------------- Header -------------------- */}
      <HeaderCustom
        to="component"
        theme={theme}
        iconSpan="info"
        title="Información general"
        className="text-2xl font-light"
        span="Datos básicos del equipo"
      />

      {/* -------------------- Basic data -------------------- */}
      <div className="grid gap-6 md:grid-cols-5">
        <div className="grid gap-4 md:col-span-5 md:grid-cols-2">
          {/* input of 2 columns */}
          <div className="md:col-span-2">
            <InputSearchableField
              name="name"
              theme={theme}
              label="Nombre"
              options={options}
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
          <div className={cn(!id || getValues('photoUrl') ? 'hidden' : 'block')}>
            <ImagePreview
              theme={theme}
              name="preview"
              alt="imgEquip"
              sizeImage='max-w-full max-h-72'
            />
          </div>
          <CardIterable
            limit={1}
            theme={theme}
            name="photoUrl"
            titleButton={cn(!id ? 'Agregar imagen' : 'Cambiar imagen')}
            fields={fields.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
          />
        </div>
      </div>
    </div>
  )
}

export default BasicDataSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fields = [{ name: "photoUrl.file", label: "Imagen del equipo", sizeImage: "w-60 h-60" }]