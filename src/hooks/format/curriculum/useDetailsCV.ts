import { Curriculum, Headquarter, Representative, Supplier, Manufacturer } from "@/interfaces/context.interface"
import { useQueryFormat, useFormatMutation } from "@/hooks/query/useFormatQuery"
import { defaultWarranty as warranties } from "@/constants/values.constants"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useAuthContext } from "@/context/AuthContext"
import { useMemo } from "react"

/** This hook is used to get the data of the details section of the curriculum form */
class DetailsCV {
  private static instance: DetailsCV

  public static getInstance(): DetailsCV {
    if (!DetailsCV.instance) { DetailsCV.instance = new DetailsCV() }
    return DetailsCV.instance
  }

  /*------------- render -------------*/
  render() {
    const { data: representatives } = useQueryFormat().fetchAllFormats<Representative>('representative')
    const { data: manufacturers } = useQueryFormat().fetchAllFormats<Manufacturer>('manufacturer')
    const { data: suppliers } = useQueryFormat().fetchAllFormats<Supplier>('supplier')

    const mapValues = (data: Curriculum) => ({
      datePurchase: data.datePurchase ? new Date(data.datePurchase) : null,
      dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : null,
      dateOperation: data.dateOperation ? new Date(data.dateOperation) : null,
      acquisition: data.acquisition,
      warranty: warranties.some(w => w.value === data.warranty) ? data.warranty : { type: "otro" as const, value: data.warranty },
      supplier: data.supplier?._id,
      manufacturer: data.manufacturer?._id,
      representative: data.representative?._id,
      price: data.price === 'N/R' ? '' : data.price
    })

    const submitData = (data: CurriculumFormProps) => ({
      datePurchase: data.datePurchase,
      dateInstallation: data.dateInstallation,
      dateOperation: data.dateOperation,
      acquisition: data.acquisition,
      warranty: typeof data.warranty === 'object' ? data.warranty.value : data.warranty,
      price: data.price === '' ? 'N/R' : data.price,
      representative: data.representative,
      manufacturer: data.manufacturer,
      supplier: data.supplier,
    })

    const mapAutocomplete = (data: Curriculum) => ({
      representative: data.representative?._id,
      manufacturer: data.manufacturer?._id,
      supplier: data.supplier?._id,
    })

    return {
      mapValues,
      mapAutocomplete,
      submitData,
      options: {
        suppliers: useMemo(() => suppliers?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.city ?? 'Sin ciudad'}` })) || [], [suppliers]),
        manufacturers: useMemo(() => manufacturers?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.country ?? 'Sin pais'}` })) || [], [manufacturers]),
        representatives: useMemo(() => representatives?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.city ?? 'Sin ciudad'}` })) || [], [representatives])
      }
    }
  }

  useRepresentative() {
    const { data: hqs } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
    const { createFormat: createRepresentativeHeadquarter } = useFormatMutation('representativeHeadquarter')
    const { createFormat: createRepresentative } = useFormatMutation('representative')
    const { user } = useAuthContext()

    const onSubmit = async (stakeholder: any) => {
      const data = await createRepresentative({ ...stakeholder, phone: stakeholder.phone || 'N/R', city: stakeholder.city || 'N/R' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions?.includes(e._id))
      if (!data || !userHeadquarters?.length) throw new Error('No fue posible completar la solicitud de representante')

      //create relation between representative and headquarters
      await Promise.all(userHeadquarters.map(async e => createRepresentativeHeadquarter({ representative: data?._id, headquarter: e._id })))
    }
    return { onSubmit }
  }

  useSupplier() {
    const { data: hqs } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
    const { createFormat: createSupplierHeadquarter } = useFormatMutation('supplierHeadquarter')
    const { createFormat: createSupplier } = useFormatMutation('supplier')
    const { user } = useAuthContext()

    const onSubmit = async (stakeholder: any) => {
      const data = await createSupplier({ ...stakeholder, phone: stakeholder.phone || 'N/R', city: stakeholder.city || 'N/R' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions?.includes(e._id))
      if (!data || !userHeadquarters?.length) throw new Error('No fue posible completar la solicitud de proveedor')

      //create relation between supplier and headquarters
      await Promise.all(userHeadquarters.map(async e => createSupplierHeadquarter({ supplier: data?._id, headquarter: e._id })))
    }
    return { onSubmit }
  }

  useManufacturer() {
    const { data: hqs } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
    const { createFormat: createManufacturerHeadquarter } = useFormatMutation('manufacturerHeadquarter')
    const { createFormat: createManufacturer } = useFormatMutation('manufacturer')
    const { user } = useAuthContext()

    const onSubmit = async (stakeholder: any) => {
      const data = await createManufacturer({ ...stakeholder, phone: stakeholder.phone || 'N/R', country: stakeholder.country || 'N/R' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions?.includes(e._id))
      if (!data || !userHeadquarters?.length) throw new Error('No fue posible completar la solicitud de fabricante')

      //create relation between manufacturer and headquarters
      await Promise.all(userHeadquarters.map(async e => createManufacturerHeadquarter({ manufacturer: data?._id, headquarter: e._id })))
    }
    return { onSubmit }
  }
}

export default DetailsCV.getInstance()