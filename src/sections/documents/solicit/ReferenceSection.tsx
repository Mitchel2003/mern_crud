import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import ImagePreview from '#/common/fields/ImagePreview'
import InputField from "#/common/fields/Input"
import { cn } from "@/lib/utils"

interface ReferenceProps extends ThemeContextProps { id: boolean }

const ReferenceSection = ({ theme, id }: ReferenceProps) => {
  return (
    <div className="space-y-4">
      <HeaderCustom
        to="component"
        theme={theme}
        title="Referencia del equipo"
        className="text-2xl font-light"
        span="Campos automáticos"
        iconSpan="warn"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="grid gap-4 lg:col-span-3 lg:grid-cols-2">
          {/* input of 2 columns */}
          <div className="md:col-span-2">
            <InputField
              readOnly
              theme={theme}
              name="cv.name"
              label="Nombre"
              placeholder="Nombre del equipo"
            />
          </div>
          <InputField
            readOnly
            theme={theme}
            name="cv.brand"
            label="Marca"
            placeholder="Marca del equipo"
          />
          <InputField
            readOnly
            theme={theme}
            label="Modelo"
            name="cv.modelEquip"
            placeholder="Modelo del equipo"
          />
          <InputField
            readOnly
            theme={theme}
            label="Serie"
            name="cv.serie"
            placeholder="Número de serie"
          />
          <InputField
            readOnly
            theme={theme}
            name="cv.healthRecord"
            label="Registro Sanitario"
            placeholder="Número de registro (invima)"
          />
        </div>

        <div className="lg:col-span-2">
          <HeaderCustom
            to="input"
            theme={theme}
            iconSpan="info"
            span="Imagen del equipo"
          />
          <div className="md:col-span-5">
            <div className={cn(!id ? 'hidden' : 'block')}>
              <ImagePreview
                theme={theme}
                alt="imgEquip"
                name="cv.preview"
                sizeImage='max-w-full max-h-72'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferenceSection