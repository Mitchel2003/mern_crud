import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Curriculum } from "@/interfaces/context.interface"
import { Metadata } from "@/interfaces/db.interface"

/** This hook is used to get the data of the basic data section of the curriculum form */
const useBasicDataCV = (id?: string) => {
  const { fetchAllFiles } = useQueryFormat()
  const { data: files } = fetchAllFiles<Metadata>('cv', { id: id as string, ref: 'preview' })

  const mapValues = (data: Curriculum) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord,
    photoUrl: data.photoUrl.map(item => ({ file: new File([], item.url) })) || [],
  })

  const submitData = (data: CurriculumFormProps) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord
  })

  return {
    files,
    mapValues,
    submitData
  }
}

export default useBasicDataCV