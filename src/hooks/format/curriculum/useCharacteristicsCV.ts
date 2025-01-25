import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the characteristics section of the curriculum form */
const useCharacteristicsCV = () => {
  const mapValues = (data: Curriculum) => ({
    characteristics: data.characteristics,
    recommendationsManufacturer: data.recommendationsManufacturer
  })

  const submitData = (data: CurriculumFormProps) => ({
    characteristics: data.characteristics,
    recommendationsManufacturer: data.recommendationsManufacturer
  })

  return { mapValues, submitData }
}

export default useCharacteristicsCV