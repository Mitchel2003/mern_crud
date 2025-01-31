import { ThemeContextProps, Group } from "@/interfaces/context.interface"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import { UseFormGetValues, UseFormWatch } from "react-hook-form"
import FormWrapper from "#/ui/step-form/step-form-wrapper"
import IterableCard from "#/common/fields/CardIterable"
import SelectMulti from "#/common/fields/SelectMulti"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { HandHelpingIcon } from "lucide-react"

interface OfficeFormProps extends ThemeContextProps {
  options: { isLoading: boolean, groups: Group[] }
  getValues: UseFormGetValues<any>,
  watch: UseFormWatch<any>,
}

const OfficeForm = ({ theme, watch, getValues, options }: OfficeFormProps) => {
  const headquarter = getValues('headquarter')
  const groupName = watch('office.group')

  const headquarters = headquarter?.name ? [{ label: `${headquarter.name} - ${headquarter.address}`, value: headquarter.address }] : []
  const groupSelected = options.groups.find((g) => g.name === groupName)
  if (options.isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <FormWrapper
      title="Consultorio"
      description="Proporcione la información del consultorio."
    >
      <IterableCard
        limit={100}
        theme={theme}
        name="office"
        titleButton="Añadir consultorio para esta sede"
        fields={[
          { name: "office.name", component: <InputField theme={theme} name="name" label="Nombre" placeholder="Nombre de la sede" /> },
          { name: "office.headquarter", component: <SelectField theme={theme} name="headquarter" label="Sede" placeholder="Selecciona la sede" span="Indica una sede referencia" options={headquarters} /> },
          { name: "office.group", component: <SelectField theme={theme} name="group" label="Grupos" placeholder="Selecciona el grupo" span="Refiere al grupo al que pertenece este consultorio" iconSpan="info" options={options.groups?.map((e) => ({ value: e.name, label: e.name })) || []} /> },
          { name: "office.services", component: <SelectMulti theme={theme} name="services" label="Servicios" placeholder="Selecciona los servicios" span="Selecciona varios servicios para este consultorio" iconSpan="warn" options={groupSelected?.services?.map((e) => ({ value: e, label: e, icon: HandHelpingIcon })) || []} /> }
        ]}
      />
    </FormWrapper>
  )
}

export default OfficeForm