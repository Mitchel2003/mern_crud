import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the technical characteristics section of the curriculum form */
const useTechCharacteristicsCV = () => {
  const mapValues = (data: Curriculum) => ({
    technicalCharacteristics: {
      voltage: data.technicalCharacteristics?.voltage,
      amperage: data.technicalCharacteristics?.amperage,
      power: data.technicalCharacteristics?.power,
      frequency: data.technicalCharacteristics?.frequency,
      capacity: data.technicalCharacteristics?.capacity,
      pressure: data.technicalCharacteristics?.pressure,
      speed: data.technicalCharacteristics?.speed,
      humidity: data.technicalCharacteristics?.humidity,
      temperature: data.technicalCharacteristics?.temperature,
      weight: data.technicalCharacteristics?.weight,
    }
  })

  const submitData = (data: CurriculumFormProps) => ({
    technicalCharacteristics: {
      voltage: data.technicalCharacteristics?.voltage,
      amperage: data.technicalCharacteristics?.amperage,
      power: data.technicalCharacteristics?.power,
      frequency: data.technicalCharacteristics?.frequency,
      capacity: data.technicalCharacteristics?.capacity,
      pressure: data.technicalCharacteristics?.pressure,
      speed: data.technicalCharacteristics?.speed,
      humidity: data.technicalCharacteristics?.humidity,
      temperature: data.technicalCharacteristics?.temperature,
      weight: data.technicalCharacteristics?.weight,
    }
  })

  const mapAutocomplete = (data: Curriculum) => ({
    technicalCharacteristics: data.technicalCharacteristics,
  })

  return { mapValues, mapAutocomplete, submitData }
}

export default useTechCharacteristicsCV