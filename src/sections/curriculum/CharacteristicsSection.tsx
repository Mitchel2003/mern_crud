import AreaField from "#/curriculum/AreaField"

import { CharacteristicsProps } from "@/interfaces/form.interface"
import { useForm } from "react-hook-form"

const CharacteristicsSection = () => {
  const form = useForm<CharacteristicsProps>()
  return (
    <div className="space-y-6">

      <h3 className="text-2xl font-bold">Características</h3>
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