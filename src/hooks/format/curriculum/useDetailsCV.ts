import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the details section of the curriculum form */
class DetailsCV {
  private static instance: DetailsCV
  readonly defaultSupplier = { name: '', email: '', phone: '', address: '', nit: '' }
  readonly defaultStakeholder = { name: '', email: '', phone: '', city: '' }

  public static getInstance(): DetailsCV {
    if (!DetailsCV.instance) { DetailsCV.instance = new DetailsCV() }
    return DetailsCV.instance
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
      price: data.price === '' ? 'n/r' : data.price
    })

    return {
      mapValues,
      submitData
    }
  }
}
export default DetailsCV.getInstance()