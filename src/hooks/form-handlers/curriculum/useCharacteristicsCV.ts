import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the characteristics section of the curriculum form */
const useCharacteristicsCV = () => {
  const mapValues = (data: Curriculum) => ({
    characteristics: data.characteristics,
    annexesPreview: data.metadata?.files || [],
    recommendationsManufacturer: data.recommendationsManufacturer
  })

  const submitData = (data: CurriculumFormProps) => ({
    characteristics: data?.characteristics ?? 'N/R',
    recommendationsManufacturer: data?.recommendationsManufacturer ?? 'N/R'
  })

  const mapAutocomplete = (data: Curriculum) => ({
    characteristics: data.characteristics,
    recommendationsManufacturer: data.recommendationsManufacturer
  })

  return { mapValues, mapAutocomplete, submitData }
}

export default useCharacteristicsCV