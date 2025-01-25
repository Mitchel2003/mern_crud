import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Curriculum } from "@/interfaces/context.interface"
import { Metadata } from "@/interfaces/db.interface"

/** This hook is used to get the data of the basic data section of the curriculum form */
const useBasicDataCV = (id?: string) => {
  const { data: img } = useQueryFormat().fetchAllFiles<Metadata>('file', { id: id as string, ref: 'preview' })

  const mapValues = (data: Curriculum) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord,
    photoUrl: img?.map(item => ({ file: new File([], item.url) })) || [],
  })

  const submitData = (data: CurriculumFormProps) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord,
    photoUrl: data.photoUrl?.[0]?.file
  })

  return { mapValues, submitData }
}

export default useBasicDataCV