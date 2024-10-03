import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import AreaField from "#/curriculum/fields/Area"
import { useForm } from "react-hook-form"

type CharacteristicsProps = {
  characteristics: string;
  recommendations_manufacturer: string;
}

const CharacteristicsSection = () => {
  const form = useForm<CharacteristicsProps>()
  return (
    <div className="space-y-6">

      <HeaderCustom
        to="section"
        title="Características"
        description="Maximo 100 caracteres"
        icon="warn"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AreaField
          name="characteristics"
          label="Características"
          control={form.control}
          placeholder="Ingrese las características del equipo"
        />
        <AreaField
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