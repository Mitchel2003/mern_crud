import { ThemeContextProps, Group, Headquarter } from "@/interfaces/context.interface"
import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import FormWrapper from "#/ui/step-form/step-form-wrapper"
import IterableCard from "#/common/fields/CardIterable"
import SelectMulti from "#/common/fields/SelectMulti"
import { UseFormGetValues } from "react-hook-form"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { HandHelpingIcon } from "lucide-react"
import { useMemo } from 'react'

interface OfficeFormProps extends ThemeContextProps {
  options: { isLoading: boolean, groups: Group[] }
  getValues: UseFormGetValues<any>,
}

const OfficeForm = ({ theme, getValues, options }: OfficeFormProps) => {
  const headquarter = getValues('headquarter') || []

  const headquarterOptions = useMemo(() =>
    headquarter.some((e: Headquarter) => e.name)
      ? headquarter.map((e: Headquarter) => ({ value: `${e.name}-${e.address}`, label: `${e.name} - ${e.address}` })) : [],
    [headquarter]
  )

  const serviceOptions = useMemo(() =>
    options.groups?.flatMap(group => (
      group.services.map(service => ({
        value: service,
        label: `${service} - ${group.name}`,
        icon: HandHelpingIcon
      }))
    )) || [],
    [options.groups]
  )

  if (options.isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <FormWrapper
      theme={theme}
      title="Consultorio"
      description="Configura los consultorios de la sede"
    >
      <IterableCard
        limit={100}
        theme={theme}
        name="office"
        titleButton="Añadir consultorio para esta sede"
        fields={[
          {
            name: "office.headquarter",
            component: <SelectField
              theme={theme}
              label="Sede"
              name="headquarter"
              options={headquarterOptions}
              placeholder="Selecciona la sede"
            />
          },
          {
            name: "office.services",
            component: <SelectMulti
              theme={theme}
              iconSpan="warn"
              name="services"
              label="Servicios"
              options={serviceOptions}
              placeholder="Selecciona los servicios"
              span="Selecciona varios servicios para este consultorio"
            />
          },
          {
            name: "office.name",
            component: <InputField
              theme={theme}
              name="name"
              label="Nombre"
              placeholder="Nombre del consultorio"
            />
          }
        ]}
      />
    </FormWrapper>
  )
}

export default OfficeForm