import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { Curriculum } from "@/interfaces/context.interface"
import { Metadata } from "@/interfaces/db.interface"

/** This hook is used to get the data of the basic data section of the curriculum form */
const useBasicDataCV = () => {
  const { data: cvs } = useQueryFormat().fetchAllFormats<Curriculum>('cv')

  const mapValues = (data: Curriculum, img?: Metadata[]) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord,
    preview: img?.[0]?.url
  })

  const submitData = (data: CurriculumFormProps) => ({
    name: data.name,
    brand: data.brand,
    serie: data.serie,
    modelEquip: data.modelEquip,
    healthRecord: data.healthRecord,
    photoUrl: data.photoUrl?.[0]?.file
  })

  const processedCvs = cvs?.reduce((unique: any[], cv: any) => {
    const exists = unique.some(item => item.name === cv.name)
    if (!exists && cv._id) unique.push(cv)
    return unique
  }, [] as Curriculum[]) || []

  return {
    mapValues,
    submitData,
    cvs: processedCvs,
    options: processedCvs.map((cv: any) => ({ value: cv.name, label: cv.name }))
  }
}

export default useBasicDataCV