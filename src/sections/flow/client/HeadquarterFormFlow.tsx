import { City, Country, State, ThemeContextProps } from "@/interfaces/context.interface";
import { useFormContext, UseFormGetValues, UseFormWatch } from "react-hook-form";
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton";
import FormWrapper from "#/ui/step-form/step-form-wrapper";
import IterableCard from "#/common/fields/CardIterable";
import SelectField from "#/common/fields/Select";
import InputField from "#/common/fields/Input";
import { Separator } from "#/ui/separator";


interface HeadquarterFormProps extends ThemeContextProps {
  options: { isLoading: boolean, cities: City[], states: State[], countries: Country[] }
  getValues: UseFormGetValues<any>,
  watch: UseFormWatch<any>,
}

const HeadquarterForm = ({ theme, watch, getValues, options }: HeadquarterFormProps) => {
  const countryId = watch('headquarter.country')
  const stateId = watch('headquarter.state')
  const client = getValues('client')
  const methods = useFormContext()

  const clients = client?.name ? [{ label: `${client.name} - ${client.phone}`, value: client.nit }] : []
  const states = options?.states?.filter((head) => head.country?._id === countryId)
  const cities = options?.cities?.filter((head) => head.state?._id === stateId)

  if (options.isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <FormWrapper
      title="Sede"
      description="Proporcione la información de la sede."
    >
      <IterableCard
        limit={50}
        theme={theme}
        name="headquarter"
        titleButton="Añadir sede para este cliente"
        fields={[
          { name: "headquarter.name", component: <InputField {...methods} theme={theme} name="name" label="Nombre" placeholder="Nombre de la sede" /> },
          { name: "headquarter.address", component: <InputField {...methods} theme={theme} name="address" label="Dirección" placeholder="Dirección de la sede" /> },
          { name: "separator", component: <Separator /> },
          { name: "headquarter.client", component: <SelectField {...methods} theme={theme} name="client" label="Cliente" placeholder="Selecciona el cliente" options={clients} /> },
          { name: "headquarter.country", component: <SelectField {...methods} theme={theme} name="country" label="País" placeholder="Selecciona el país" options={options.countries?.map((c) => ({ label: c.name, value: c._id })) || []} /> },
          { name: "headquarter.state", component: <SelectField {...methods} theme={theme} name="state" label="Departamento" placeholder="Selecciona el departamento" options={states?.map((c) => ({ label: c.name, value: c._id })) || []} /> },
          { name: "headquarter.city", component: <SelectField {...methods} theme={theme} name="city" label="Ciudad" placeholder="Selecciona la ciudad" options={cities?.map((c) => ({ label: c.name, value: c._id })) || []} /> }
        ]}
      />
    </FormWrapper>
  )
}

export default HeadquarterForm