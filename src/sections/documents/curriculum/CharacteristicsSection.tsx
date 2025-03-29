import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import AreaField from "#/common/fields/Area"

interface CharacteristicsProps extends ThemeContextProps { }

const CharacteristicsSection = ({ theme }: CharacteristicsProps) => (
  <div className="space-y-6">
    <HeaderCustom
      to="component"
      theme={theme}
      iconSpan="warn"
      title="Características"
      span="Campos opcionales"
      className="text-2xl font-light"
    />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <AreaField
        theme={theme}
        name="characteristics"
        label="Características"
        placeholder="Ingrese las características del equipo"
      />
      <AreaField
        theme={theme}
        name="recommendationsManufacturer"
        label="Recomendaciones del Fabricante"
        placeholder="Ingrese las recomendaciones del fabricante"
      />
    </div>
  </div>
)

export default CharacteristicsSection