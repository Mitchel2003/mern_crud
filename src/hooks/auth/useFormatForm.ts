import { Area, Headquarter, Office, Service, Curriculum, Client } from "@/interfaces/context.interface"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  curriculumSchema, CurriculumFormProps,
  inspectionSchema, InspectionFormProps
} from "@/schemas/format.schema"
import { useQueryUser } from "../query/useUserQuery"

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

  const equipmentData = useEquipmentClassificationCV()
  const technicalData = useTechnicalCharacteristicsCV()
  const detailsData = useDetailsEquipmentCV.render()
  const maintenanceData = useMaintenanceCV()
  const locationData = useLocationCV()
  const basicData = useBasicDataCV(id)

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onChange",
  })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    cv && methods.reset({
      ...locationData.mapValues(cv),
      ...basicData.mapValues(cv),
      ...detailsData.mapValues(cv),
      ...equipmentData.mapValues(cv),
      ...maintenanceData.mapValues(cv),
      ...technicalData.mapValues(cv),
    })
  }

  const handleSubmit = useFormSubmit({
    onSubmit: async (e: any) => {
      console.log(e)
      const data = {
        ...locationData.submitData(e),
        ...basicData.submitData(e),
        ...detailsData.submitData(e),
        ...equipmentData.submitData(e),
        ...maintenanceData.submitData(e),
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
    basicData: basicData.files,
    locationData: locationData.options,
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
  const { fetchAllUsers } = useQueryUser()

  const { data: clients } = fetchAllUsers<Client>('client')
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: services } = fetchAllLocations<Service>('service')
  const { data: offices } = fetchAllLocations<Office>('office')
  const { data: areas } = fetchAllLocations<Area>('area')

  const mapValues = (data: Curriculum) => ({
    client: data.office.area.headquarter?.client?._id,
    headquarter: data.office.area.headquarter?._id,
    area: data.office.area?._id,
    office: data.office?._id,
    service: data.service
  })

  const submitData = (data: CurriculumFormProps) => ({
    service: data.service,
    office: data.office
  })

  return { mapValues, submitData, options: { clients, headquarters, services, offices, areas } }
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
    healthRecord: data.healthRecord
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
}
export const useDetailsEquipmentCV = DetailsEquipmentCV.getInstance()
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------equipmentClassification--------------------------------------------------*/
const useEquipmentClassificationCV = () => {
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

  return { mapValues, submitData }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------maintenance--------------------------------------------------*/
const useMaintenanceCV = () => {
  const mapValues = (data: Curriculum) => ({
    employmentMaintenance: data.employmentMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    typeMaintenance: data.typeMaintenance,
    manualsMaintenance: data.manualsMaintenance,
  })

  const submitData = (data: CurriculumFormProps) => ({
    employmentMaintenance: data.employmentMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    typeMaintenance: data.typeMaintenance,
    manualsMaintenance: data.manualsMaintenance,
  })

  return { mapValues, submitData }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------technicalCharacteristics--------------------------------------------------*/
const useTechnicalCharacteristicsCV = () => {
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

  return { mapValues, submitData }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------inspection--------------------------------------------------*/
class InspectionCV {
  private static instance: InspectionCV
  readonly defaultInspection = { name: '', typeInspection: [] }

  public static getInstance(): InspectionCV {
    if (!InspectionCV.instance) { InspectionCV.instance = new InspectionCV() }
    return InspectionCV.instance
  }

  /*------------- render -------------*/
  // render() {
  //   const { fetchAllFormats } = useQueryFormat()
  //   const { data: inspections } = fetchAllFormats<Inspection>('inspection')

  //   const mapValues = (data: Curriculum) => ({
  //     name: data.inspection.name,
  //     typeInspection: data.inspection.typeInspection
  //   })

  //   const submitData = (data: CurriculumFormProps) => ({
  //     inspection: data.inspection
  //   })

  //   return {
  //     mapValues,
  //     submitData,
  //     options: inspections?.map((e) => ({ value: e._id, label: e.name })) || [],
  //   }
  // }

  /*------------- inspection -------------*/
  useInspection() {//to handle inspection
    const { createFormat } = useFormatMutation('inspection')
    const methods = useForm<InspectionFormProps>({
      resolver: zodResolver(inspectionSchema),
      defaultValues: this.defaultInspection,
      mode: "onChange",
    })
    const handleSubmit = useFormSubmit({ onSubmit: async (e: any) => { createFormat(e); methods.reset() } }, methods)
    return { methods, ...handleSubmit }
  }
}
export const useInspectionCV = InspectionCV.getInstance()
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default values--------------------------------------------------*/
const curriculumDefaultValues: CurriculumFormProps = {
  //helpers fields not has been sent to database
  client: '', //helper locationData
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

  datePurchase: null, //datailsEquipment
  dateOperation: null, //datailsEquipment
  dateInstallation: null, //datailsEquipment
  acquisition: '', //datailsEquipment
  warranty: '', //datailsEquipment
  price: '', //datailsEquipment

  //equipment
  useClassification: '', //equipmentClassification
  typeClassification: '', //equipmentClassification
  biomedicalClassification: '', //equipmentClassification
  riskClassification: '', //equipmentClassification
  technologyPredominant: [], //equipmentClassification
  powerSupply: [], //equipmentClassification

  //technical characteristics
  technicalCharacteristics: {
    voltage: '', //technicalCharacteristics
    amperage: '', //technicalCharacteristics
    power: '', //technicalCharacteristics
    frequency: '', //technicalCharacteristics
    capacity: '', //technicalCharacteristics
    pressure: '', //technicalCharacteristics
    speed: '', //technicalCharacteristics
    humidity: '', //technicalCharacteristics
    temperature: '', //technicalCharacteristics
    weight: '', //technicalCharacteristics
  },

  //maintenance
  employmentMaintenance: '', //maintenance
  frequencyMaintenance: '', //maintenance
  typeMaintenance: [], //maintenance
  manualsMaintenance: '', //maintenance

  //relationship
  // inspection: '',
  //supplier: '', //datailsEquipment
  //manufacturer: '', //datailsEquipment
  //representative: '', //datailsEquipment
}
