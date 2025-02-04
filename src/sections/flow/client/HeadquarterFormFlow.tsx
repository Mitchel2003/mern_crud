import { City, ThemeContextProps } from "@/interfaces/context.interface"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import InputSearchableField from "#/common/fields/InputSearchable"
import FormWrapper from "#/ui/step-form/step-form-wrapper"
import IterableCard from "#/common/fields/CardIterable"
import InputField from "#/common/fields/Input"

interface HeadquarterFormProps extends ThemeContextProps {
  options: { isLoading: boolean, cities: City[] }
}

const HeadquarterForm = ({ theme, options }: HeadquarterFormProps) => {
  //to fill select searchable with cities-state-country
  const cityOptions = options.cities?.map((c) => ({
    value: c?._id,
    label: `${c.name || 'sin nombre'} - ${c.state?.name || 'sin departamento'} - ${c.state?.country?.name || 'sin país'}`
  })) || []

  // const cityOptions = useMemo(() =>
  //   options.groups?.flatMap(group => (
  //     group.services.map(service => ({
  //       value: service,
  //       label: `${service} - ${group.name}`,
  //       icon: HandHelpingIcon
  //     }))
  //   )) || [],
  //   [options.groups]
  // )

  if (options.isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <FormWrapper
      title="Sede"
      theme={theme}
      description="Proporcione la información de la sede."
    >
      <IterableCard
        limit={50}
        theme={theme}
        name="headquarter"
        titleButton="Añadir sede para este cliente"
        fields={[
          {
            name: `headquarter.name`,
            component: <InputField
              theme={theme}
              label="Nombre"
              name={`headquarter.name`}
              placeholder="Nombre de la sede"
            />
          },
          {
            name: `headquarter.address`,
            component: <InputField
              theme={theme}
              label="Dirección"
              name={`headquarter.address`}
              placeholder="Dirección de la sede"
            />
          },
          {
            name: `headquarter.city`,
            component: <InputSearchableField
              theme={theme}
              label="Ciudad"
              options={cityOptions}
              name={`headquarter.city`}
              placeholder="Selecciona la ciudad"
            />
          }
        ]}
      />
    </FormWrapper>
  )
}

export default HeadquarterForm