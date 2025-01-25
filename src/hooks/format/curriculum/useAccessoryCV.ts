import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Accessory } from "@/interfaces/context.interface"

/** This hook is used to get the data of the location section of the curriculum form */
const useAccessoryCV = () => {
  const mapValues = (acc?: Accessory[]) => ({
    newAccessories: acc ?? []
  })

  const submitData = (data: CurriculumFormProps) => ({
    newAccessories: data.newAccessories ?? []
  })

  return {
    mapValues,
    submitData
  }
}

export default useAccessoryCV