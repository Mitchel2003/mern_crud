import { ThemeContextProps } from "@/interfaces/context.interface"
import { Search } from "lucide-react"

import HeaderCustom from "#/common/elements/HeaderCustom"
import InputField from "#/common/fields/Input"
import { Button } from "#/ui/button"

interface ReferenceProps extends ThemeContextProps { img: string }

const ReferenceSection = ({ img, theme }: ReferenceProps) => {
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
          <div className="relative group rounded-lg overflow-hidden">
            <img alt="Equipo" className="w-full max-h-52 object-cover" src={img || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20" onClick={() => window.open(img, '_blank')}>
                <Search className="w-4 h-4 mr-2" />
                Ver imagen completa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferenceSection