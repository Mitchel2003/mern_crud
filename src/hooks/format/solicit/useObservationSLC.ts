import { SolicitFormProps } from "@/schemas/format/solicit.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the observation section of the solicit form */
const useObservationSLC = () => {

  const mapValues = (data: Curriculum) => ({
    cv: {
      name: data.name,
      brand: data.brand,
      serie: data.serie,
      preview: data.photoUrl,
      modelEquip: data.modelEquip,
      healthRecord: data.healthRecord
    }
  })

  const submitData = (data: SolicitFormProps, curriculumId: string) => ({
    message: data.message,
    curriculum: curriculumId,
    priority: data.priority === 'high' ? true : false,
  })

  return { mapValues, submitData }
}

export default useObservationSLC