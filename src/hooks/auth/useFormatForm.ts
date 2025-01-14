import { Area, Headquarter, Office, Service, Curriculum } from "@/interfaces/context.interface"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  curriculumSchema, CurriculumFormProps,
  stakeholderSchema, StakeholderFormProps,
  supplierSchema, SupplierFormProps
} from "@/schemas/format.schema"

/*--------------------------------------------------hooks use form--------------------------------------------------*/
/**
 * Hook principal que orquesta los sub-hooks
 * @param id - ID del currículum a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCurriculumForm = (id?: string, onSuccess?: () => void) => {
  const { fetchFormatById } = useQueryFormat()
  const { createFormat, updateFormat } = useFormatMutation("cv")
  const { data: cv } = fetchFormatById<Curriculum>('cv', id as string)
  const technicalData = useTechnicalCharacteristicsCV()
  const detailsData = useDetailsEquipmentCV.render()
  const locationData = useLocationCV()
  const basicData = useBasicDataCV(id)

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    cv && methods.reset({
      ...locationData.mapValues(cv),
      ...basicData.mapValues(cv),
      ...detailsData.mapValues(cv),
      ...technicalData.mapValues(cv),
    })
  }

  const handleSubmit = useFormSubmit({
    onSubmit: async (e: any) => {
      const data = {
        ...locationData.submitData(e),
        ...basicData.submitData(e),
        ...technicalData.submitData(e),
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
    locationData: locationData.options,
    basicData: basicData.files,
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * This conjunt of tools allow us to operate the sections of the form,
 * to load data, to map data and to submit data; have a single source.
 * 
 * @argument Curriculum - Curriculum interface, consist in subs hooks that return the data of the form
 * @argument Maintenance - Maintenance interface, consist in subs hooks that return the data of the form
 */

/*--------------------------------------------------locationData--------------------------------------------------*/
const useLocationCV = () => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: services } = fetchAllLocations<Service>('service')
  const { data: offices } = fetchAllLocations<Office>('office')
  const { data: areas } = fetchAllLocations<Area>('area')

  const mapValues = (data: Curriculum) => ({
    headquarter: data.office.area.headquarter?._id,
    area: data.office.area?._id,
    office: data.office?._id,
    service: data.service
  })

  const submitData = (data: CurriculumFormProps) => ({
    service: data.service,
    office: data.office
  })

  return { mapValues, submitData, options: { headquarters, services, offices, areas } }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------basicData--------------------------------------------------*/
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
    healthRecord: data.healthRecord,
    photoUrl: data.photoUrl || [],
  })

  return { files, mapValues, submitData }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------detailsEquipment--------------------------------------------------*/
class DetailsEquipmentCV {
  private static instance: DetailsEquipmentCV
  readonly defaultSupplier = { name: '', email: '', phone: '', address: '', nit: '' }
  readonly defaultStakeholder = { name: '', email: '', phone: '', city: '' }

  public static getInstance(): DetailsEquipmentCV {
    if (!DetailsEquipmentCV.instance) { DetailsEquipmentCV.instance = new DetailsEquipmentCV() }
    return DetailsEquipmentCV.instance
  }

  /*------------- render -------------*/
  render() {
    const mapValues = (data: Curriculum) => ({
      datePurchase: data.datePurchase ? new Date(data.datePurchase) : null,
      dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : null,
      dateOperation: data.dateOperation ? new Date(data.dateOperation) : null,
      acquisition: data.acquisition,
      warranty: data.warranty,
      price: data.price
    })

    const submitData = (data: CurriculumFormProps) => ({
      datePurchase: data.datePurchase,
      dateInstallation: data.dateInstallation,
      dateOperation: data.dateOperation,
      acquisition: data.acquisition,
      warranty: data.warranty,
      price: data.price
    })

    return {
      mapValues,
      submitData
    }
  }

  /*------------- representative -------------*/
  useRepresentative() {//to handle representative
    const { createFormat } = useFormatMutation('representative')
    const methods = useForm<StakeholderFormProps>({
      resolver: zodResolver(stakeholderSchema),
      defaultValues: this.defaultStakeholder,
      mode: "onChange",
    })
    const handleSubmit = useFormSubmit({ onSubmit: async (e: any) => { createFormat(e); methods.reset() } }, methods)
    return { methods, ...handleSubmit }
  }

  /*------------- supplier -------------*/
  useSupplier() {//to handle supplier
    const { createFormat } = useFormatMutation('supplier')
    const methods = useForm<SupplierFormProps>({
      resolver: zodResolver(supplierSchema),
      defaultValues: this.defaultSupplier,
      mode: "onChange",
    })
    const handleSubmit = useFormSubmit({ onSubmit: async (e: any) => { createFormat(e); methods.reset() } }, methods)
    return { methods, ...handleSubmit }
  }

  /*------------- manufacturer -------------*/
  useManufacturer() {//to handle manufacturer
    const { createFormat } = useFormatMutation('manufacturer')
    const methods = useForm<StakeholderFormProps>({
      resolver: zodResolver(stakeholderSchema),
      defaultValues: this.defaultStakeholder,
      mode: "onChange",
    })
    const handleSubmit = useFormSubmit({ onSubmit: async (e: any) => { createFormat(e); methods.reset() } }, methods)
    return { methods, ...handleSubmit }
  }
}
export const useDetailsEquipmentCV = DetailsEquipmentCV.getInstance()
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------technicalCharacteristics--------------------------------------------------*/
const useTechnicalCharacteristicsCV = () => {
  const mapValues = (data: Curriculum) => ({
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
  })

  const submitData = (data: CurriculumFormProps) => ({
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
  })

  return { mapValues, submitData }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default values--------------------------------------------------*/
const curriculumDefaultValues: CurriculumFormProps = {
  //helpers fields not has been sent to database
  headquarter: '', //helper locationData
  area: '', //helper locationData
  office: '', //locationData
  service: '', //locationData

  name: '', //basicData
  brand: '', //basicData
  serie: '', //basicData
  modelEquip: '', //basicData
  healthRecord: '', //basicData
  photoUrl: [{ file: new File([], '') }], //basicData (create after that cv)

  characteristics: '',
  recommendationsManufacturer: '',

  datePurchase: null, //datailsEquipment
  dateOperation: null, //datailsEquipment
  dateInstallation: null, //datailsEquipment
  acquisition: '', //datailsEquipment
  warranty: '', //datailsEquipment
  price: '', //datailsEquipment

  //equipment
  useClassification: '',
  typeClassification: '',
  biomedicalClassification: '',
  riskClassification: '',
  technologyPredominant: [],
  powerSupply: [],

  //technical characteristics
  technicalCharacteristics: {
    voltage: '',
    amperage: '',
    power: '',
    frequency: '',
    capacity: '',
    pressure: '',
    speed: '',
    humidity: '',
    temperature: '',
    weight: '',
  },

  //maintenance
  employmentMaintenance: '',
  frequencyMaintenance: '',
  typeMaintenance: [],
  manualsMaintenance: '',

  //relationship
  inspection: '',
  //supplier: '', //datailsEquipment
  //manufacturer: '', //datailsEquipment
  //representative: '', //datailsEquipment
}
