import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the equipment classification section of the curriculum form */
const useEquipClassificationCV = () => {
  const mapValues = (data: Curriculum) => ({
    useClassification: data.useClassification,
    typeClassification: data.typeClassification,
    biomedicalClassification: data.biomedicalClassification,
    riskClassification: data.riskClassification,
    technologyPredominant: data.technologyPredominant,
    powerSupply: data.powerSupply,
  })

  const submitData = (data: CurriculumFormProps) => ({
    useClassification: data.useClassification,
    typeClassification: data.typeClassification,
    biomedicalClassification: data.biomedicalClassification,
    riskClassification: data.riskClassification,
    technologyPredominant: data.technologyPredominant,
    powerSupply: data.powerSupply,
  })

  const mapAutocomplete = (data: Curriculum) => ({
    typeClassification: data.typeClassification,
    useClassification: data.useClassification,
    riskClassification: data.riskClassification,
    biomedicalClassification: data.biomedicalClassification,
    technologyPredominant: data.technologyPredominant,
    powerSupply: data.powerSupply,
  })

  return { mapValues, mapAutocomplete, submitData }
}

export default useEquipClassificationCV