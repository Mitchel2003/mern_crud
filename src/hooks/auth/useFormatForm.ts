import { Area, Headquarter, Office, Service, Curriculum } from "@/interfaces/context.interface"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/auth/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  curriculumSchema, CurriculumFormProps,
} from "@/schemas/format.schema"

/*--------------------------------------------------useCurriculumForm--------------------------------------------------*/
const curriculumDefaultValues = {
  headquarter: '', //locationData //helper(this field not was send to backend)
  area: '', //locationData //helper(this field not was send to backend)
  office: '', //locationData
  service: '', //locationData

  name: '', //basicData
  brand: '', //basicData
  serie: '', //basicData
  modelEquip: '', //basicData
  healthRecord: '', //basicData
  photoUrl: [{ file: undefined }], //basicData

  characteristics: '',
  recommendationsManufacturer: '',

  //details
  datePurchase: '',
  dateOperation: '',
  dateInstallation: '',
  dateManufacturing: '',
  acquisition: '',
  warranty: '',
  price: '',

  //equipment
  useClassification: '',
  typeClassification: '',
  biomedicalClassification: '',
  riskClassification: '',
  technologyPredominant: [],
  powerSupply: [],

  //maintenance
  employmentMaintenance: '',
  frequencyMaintenance: '',
  typeMaintenance: [],
  manualsMaintenance: '',

  //relationship
  supplier: '',
  manufacturer: '',
  representative: '',
}

/**
 * Hook principal que orquesta los sub-hooks
 * @param id - ID del currículum a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCurriculumForm = (id?: string, onSuccess?: () => void) => {
  const { fetchFormatById } = useQueryFormat()
  const { createFormat, updateFormat } = useFormatMutation("cv")
  const { data: cv } = fetchFormatById<Curriculum>('cv', id as string)
  const locationData = useCurriculumLocation()
  const basicData = useCurriculumBasicData(id)

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onTouched",
  })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    cv && methods.reset({
      ...locationData.mapValues(cv),
      ...basicData.mapValues(cv)
    })
  }

  const handleSubmit = useFormSubmit({
    onSubmit: async (e: any) => {
      const data = {
        ...locationData.submitData(e),
        ...basicData.submitData(e)
      }
      id ? updateFormat({ id, data }) : createFormat(data)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    id,
    methods,
    ...handleSubmit,
    files: basicData.files || [],
    options: locationData.options
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------subCurriculumForm--------------------------------------------------*/
const useCurriculumLocation = () => { //locationData
  const { fetchAllLocations } = useQueryLocation()
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: services } = fetchAllLocations<Service>('service')
  const { data: offices } = fetchAllLocations<Office>('office')
  const { data: areas } = fetchAllLocations<Area>('area')

  const mapValues = (data: Curriculum) => ({
    headquarter: data.office.area.headquarter._id,
    area: data.office.area._id,
    office: data.office._id,
    service: data.service
  })

  const submitData = (data: CurriculumFormProps) => ({
    service: data.service,
    office: data.office
  })

  return {
    mapValues,
    submitData,
    options: { headquarters, services, offices, areas },
  }
}

const useCurriculumBasicData = (id?: string) => { //basicData
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
    healthRecord: data.healthRecord,
    photoUrl: data.photoUrl || [],
  })

  return {
    files,
    mapValues,
    submitData,
  }
}
/*---------------------------------------------------------------------------------------------------------*/