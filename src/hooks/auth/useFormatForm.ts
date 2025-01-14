import { Area, Headquarter, Office, Service, Curriculum, RepresentativeHeadquarter, ManufacturerHeadquarter, SupplierHeadquarter } from "@/interfaces/context.interface"
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
  const detailsData = useDetailsEquipmentCV.render(id)
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
    locationData: locationData.options,
    basicData: basicData.files,
    detailsData: detailsData.options
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------hooks use subForm--------------------------------------------------*/
{/*------------------------- locationData -------------------------*/ }
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
{/*----------------------------------------------------------------------*/ }

{/*------------------------- basicData -------------------------*/ }
const useBasicDataCV = (id?: string) => {//basicData
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
{/*----------------------------------------------------------------------*/ }

{/*------------------------- detailsEquipment -------------------------*/ }
class DetailsEquipmentCV {
  private static instance: DetailsEquipmentCV
  readonly defaultSupplier = { name: '', email: '', phone: '', address: '', nit: '' }
  readonly defaultStakeholder = { name: '', email: '', phone: '', city: '' }

  public static getInstance(): DetailsEquipmentCV {
    if (!DetailsEquipmentCV.instance) { DetailsEquipmentCV.instance = new DetailsEquipmentCV() }
    return DetailsEquipmentCV.instance
  }

  render(id: string | undefined) {//to load data on select fields
    const { fetchFormatByQuery } = useQueryFormat()
    const { data: representatives } = fetchFormatByQuery<RepresentativeHeadquarter>('representativeHeadquarter', { headquarter: id })
    const { data: manufacturers } = fetchFormatByQuery<ManufacturerHeadquarter>('manufacturerHeadquarter', { headquarter: id })
    const { data: suppliers } = fetchFormatByQuery<SupplierHeadquarter>('supplierHeadquarter', { headquarter: id })

    const mapValues = (data: Curriculum) => ({
      datePurchase: data.datePurchase ? new Date(data.datePurchase) : undefined,
      dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : undefined,
      dateOperation: data.dateOperation ? new Date(data.dateOperation) : undefined,
      acquisition: data.acquisition,
      warranty: data.warranty,
      price: data.price,
      //representative: data.representative?._id,
      //manufacturer: data.manufacturer?._id,
      //supplier: data.supplier?._id,
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
      submitData,
      options: {
        representative: representatives?.map((e) => ({ value: e.representative?._id, label: `${e.representative?.name} - ${e.representative?.city}` })) || [],
        supplier: suppliers?.map((e) => ({ value: e.supplier?._id, label: `${e.supplier?.name} - ${e.supplier?.address} - ${e.supplier?.nit}` })) || [],
        manufacturer: manufacturers?.map((e) => ({ value: e.manufacturer?._id, label: `${e.manufacturer?.name} - ${e.manufacturer?.city}` })) || [],
      }
    }
  }

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
  technicalCharacteristics: [],
  recommendationsManufacturer: '',

  //working here...
  datePurchase: new Date(), //datailsEquipment
  dateOperation: new Date(), //datailsEquipment
  dateInstallation: new Date(), //datailsEquipment
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
