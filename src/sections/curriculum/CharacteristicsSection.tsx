import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import AreaField from "#/curriculum/fields/Area"
import { useForm } from "react-hook-form"

interface CharacteristicsProps extends ThemeContextProps { }

const CharacteristicsSection = ({ theme }: CharacteristicsProps) => {
  const form = useForm<CharacteristicsProps>()
  return (
    <div className="space-y-6">

      <HeaderCustom
        theme={theme}
        to="section"
        title="Características"
        description="Maximo 100 caracteres"
        icon="warn"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AreaField
          theme={theme}
          name="characteristics"
          label="Características"
          control={form.control}
          placeholder="Ingrese las características del equipo"
        />
        <AreaField
          theme={theme}
          name="recommendations_manufacturer"
          label="Recomendaciones del Fabricante"
          control={form.control}
          placeholder="Ingrese las recomendaciones del fabricante"
        />
      </div>
    </div>
  )
}

export default CharacteristicsSection