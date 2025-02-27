import { Curriculum, RepresentativeHeadquarter, Headquarter, Representative, User, SupplierHeadquarter, Supplier, Manufacturer, ManufacturerHeadquarter } from "@/interfaces/context.interface"
import { useQueryFormat, useFormatMutation } from "@/hooks/query/useFormatQuery"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { defaultWarranty as warranties } from "@/utils/constants"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { SelectOptionProps } from "@/interfaces/props.interface"
import { useAuthContext } from "@/context/AuthContext"

/** This hook is used to get the data of the details section of the curriculum form */
class DetailsCV {
  private static instance: DetailsCV

  public static getInstance(): DetailsCV {
    if (!DetailsCV.instance) { DetailsCV.instance = new DetailsCV() }
    return DetailsCV.instance
  }

  /*------------- render -------------*/
  render() {
    const { user } = useAuthContext()
    const mapValues = (data: Curriculum) => ({
      datePurchase: data.datePurchase ? new Date(data.datePurchase) : null,
      dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : null,
      dateOperation: data.dateOperation ? new Date(data.dateOperation) : null,
      acquisition: data.acquisition,
      warranty: warranties.some(w => w.value === data.warranty) ? data.warranty : { type: "otro" as const, value: data.warranty },
      supplier: data.supplier?._id,
      manufacturer: data.manufacturer?._id,
      representative: data.representative?._id,
      price: data.price === 'n/r' ? '' : data.price
    })

    const submitData = (data: CurriculumFormProps) => ({
      datePurchase: data.datePurchase,
      dateInstallation: data.dateInstallation,
      dateOperation: data.dateOperation,
      acquisition: data.acquisition,
      warranty: typeof data.warranty === 'object' ? data.warranty.value : data.warranty,
      price: data.price === '' ? 'n/r' : data.price,
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
        suppliers: supplierFields(user),
        manufacturers: manufacturerFields(user),
        representatives: representativeFields(user)
      }
    }
  }

  useRepresentative() {
    const { data: hqs } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
    const { createFormat: createRepresentativeHeadquarter } = useFormatMutation('representativeHeadquarter')
    const { createFormat: createRepresentative } = useFormatMutation('representative')
    const { user } = useAuthContext()

    const onSubmit = async (stakeholder: any) => {
      const data = await createRepresentative({ ...stakeholder, phone: stakeholder.phone || 'n/r', city: stakeholder.city || 'n/r' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions.headquarters?.includes(e._id))
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
      const data = await createSupplier({ ...stakeholder, phone: stakeholder.phone || 'n/r', city: stakeholder.city || 'n/r' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions.headquarters?.includes(e._id))
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
      const data = await createManufacturer({ ...stakeholder, phone: stakeholder.phone || 'n/r', country: stakeholder.country || 'n/r' })
      const userHeadquarters = user?.role === 'admin' ? hqs : hqs?.filter(e => user?.permissions.headquarters?.includes(e._id))
      if (!data || !userHeadquarters?.length) throw new Error('No fue posible completar la solicitud de fabricante')

      //create relation between manufacturer and headquarters
      await Promise.all(userHeadquarters.map(async e => createManufacturerHeadquarter({ manufacturer: data?._id, headquarter: e._id })))
    }
    return { onSubmit }
  }
}
export default DetailsCV.getInstance()
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * This function is used to get the options for the representative field
 * @param {User} user - The user object, contains the role and permissions
 * @returns {SelectOptionProps[]} The options for the representative field
 */
const representativeFields = (user: User): SelectOptionProps[] => {
  const { data: representativeHeadquarters } = useQueryFormat().fetchAllFormats<RepresentativeHeadquarter>('representativeHeadquarter')
  const { data: representatives } = useQueryFormat().fetchAllFormats<Representative>('representative')

  return user?.role === 'admin'
    ? representatives?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.city ?? 'Sin ciudad'}` })) || []
    : representativeHeadquarters?.filter(rh => user?.permissions.headquarters?.includes(rh.headquarter))
      ?.reduce((unique, rep) => {
        const exists = unique.some(item => item.value === rep.representative?._id)
        if (!exists && rep.representative?._id) { unique.push({ value: rep.representative._id, label: `${rep.representative.name ?? 'Sin nombre'} - ${rep.representative.phone ?? 'Sin telefono'} - ${rep.representative.city ?? 'Sin ciudad'}` }) }
        return unique
      }, [] as SelectOptionProps[]) || []
}

/**
 * This function is used to get the options for the supplier field
 * @param {User} user - The user object, contains the role and permissions
 * @returns {SelectOptionProps[]} The options for the supplier field
 */
const supplierFields = (user: User): SelectOptionProps[] => {
  const { data: supplierHeadquarters } = useQueryFormat().fetchAllFormats<SupplierHeadquarter>('supplierHeadquarter')
  const { data: suppliers } = useQueryFormat().fetchAllFormats<Supplier>('supplier')

  return user?.role === 'admin'
    ? suppliers?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.city ?? 'Sin ciudad'}` })) || []
    : supplierHeadquarters?.filter(rh => user?.permissions.headquarters?.includes(rh.headquarter))
      ?.reduce((unique, rep) => {
        const exists = unique.some(item => item.value === rep.supplier?._id)
        if (!exists && rep.supplier?._id) { unique.push({ value: rep.supplier._id, label: `${rep.supplier.name ?? 'Sin nombre'} - ${rep.supplier?.phone ?? 'Sin telefono'} - ${rep.supplier.city ?? 'Sin ciudad'}` }) }
        return unique
      }, [] as SelectOptionProps[]) || []
}

/**
 * This function is used to get the options for the manufacturer field
 * @param {User} user - The user object, contains the role and permissions
 * @returns {SelectOptionProps[]} The options for the manufacturer field
 */
const manufacturerFields = (user: User): SelectOptionProps[] => {
  const { data: manufacturerHeadquarters } = useQueryFormat().fetchAllFormats<ManufacturerHeadquarter>('manufacturerHeadquarter')
  const { data: manufacturers } = useQueryFormat().fetchAllFormats<Manufacturer>('manufacturer')

  return user?.role === 'admin'
    ? manufacturers?.map(e => ({ value: e._id, label: `${e.name ?? 'Sin nombre'} - ${e.phone ?? 'Sin telefono'} - ${e.country ?? 'Sin pais'}` })) || []
    : manufacturerHeadquarters?.filter(rh => user?.permissions.headquarters?.includes(rh.headquarter))
      ?.reduce((unique, rep) => {
        const exists = unique.some(item => item.value === rep.manufacturer?._id)
        if (!exists && rep.manufacturer?._id) { unique.push({ value: rep.manufacturer._id, label: `${rep.manufacturer.name ?? 'Sin nombre'} - ${rep.manufacturer.phone ?? 'Sin telefono'} - ${rep.manufacturer.country ?? 'Sin pais'}` }) }
        return unique
      }, [] as SelectOptionProps[]) || []
}