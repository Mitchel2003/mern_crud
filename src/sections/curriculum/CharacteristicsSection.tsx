import AreaField from "#/curriculum/fields/Area"
import HeaderText from "@/components/curriculum/reusables/HeaderText"

import { CharacteristicsProps } from "@/interfaces/form.interface"
import { useForm } from "react-hook-form"

const CharacteristicsSection = () => {
  const form = useForm<CharacteristicsProps>()
  return (
    <div className="space-y-6">

      <HeaderText
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