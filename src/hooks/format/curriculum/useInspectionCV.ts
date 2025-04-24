import { useQueryFormat, useFormatMutation } from "@/hooks/query/useFormatQuery"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum, Inspection } from "@/interfaces/context.interface"
import { SelectOptionProps } from "@/interfaces/props.interface"

/** This hook is used to get the data of the details section of the curriculum form */
class InspectionCV {
  private static instance: InspectionCV

  public static getInstance(): InspectionCV {
    if (!InspectionCV.instance) { InspectionCV.instance = new InspectionCV() }
    return InspectionCV.instance
  }

  /*------------- render -------------*/
  render() {
    const mapValues = (data: Curriculum) => ({ inspection: data.inspection?._id })
    const submitData = (data: CurriculumFormProps) => ({ inspection: data.inspection })
    return { mapValues, submitData, options: { inspections: inspectionFields() } }
  }

  useInspection() {
    const { createFormat: createInspection } = useFormatMutation('inspection')
    const onSubmit = async (inspection: any) => await createInspection(inspection)
    return { onSubmit }
  }
}

export default InspectionCV.getInstance()
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * This function is used to get the options for the inspection field
 * @returns {SelectOptionProps[]} The options for the inspection field
 */
const inspectionFields = (): SelectOptionProps[] => {
  const { data: inspections } = useQueryFormat().fetchAllFormats<Inspection>('inspection')

  return inspections
    ?.filter(inspection => !inspection.inactive)
    ?.map(inspection => ({ value: inspection._id, label: inspection.name ?? 'Sin nombre' })) || []
}