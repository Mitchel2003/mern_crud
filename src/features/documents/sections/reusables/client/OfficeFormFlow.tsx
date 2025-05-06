import { ThemeContextProps, Headquarter } from "@/interfaces/context.interface"
import { groupCollection as groups } from "@/constants/values.constants"
import FormWrapper from "#/ui/step-form/step-form-wrapper"
import IterableCard from "#/common/fields/CardIterable"
import SelectMulti from "#/common/fields/SelectMulti"
import { UseFormGetValues } from "react-hook-form"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { HandHelpingIcon } from "lucide-react"
import { useMemo } from 'react'

interface OfficeFormProps extends ThemeContextProps {
  getValues: UseFormGetValues<any>
}

const OfficeForm = ({ theme, getValues }: OfficeFormProps) => {
  const headquarter = getValues('headquarter') || []

  /** Returns a list of headquarter with the appropriate format */
  const headquarterOptions = useMemo(() => (
    headquarter.some((e: Headquarter) => e.name) ? headquarter.map((e: Headquarter) => ({
      label: `${e.name} - ${e.address}`,
      value: `${e.name}-${e.address}`
    })) : []
  ), [headquarter])

  /** Returns a list of services with the appropriate format */
  const serviceOptions = useMemo(() => (
    groups?.flatMap(group => group.services.map(service => ({
      label: `${service} - ${group.name}`,
      value: `${service} - ${group.name}`,
      icon: HandHelpingIcon
    }))) || []
  ), [groups])

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
              span="Puedes seleccionar varios"
              placeholder="Selecciona los servicios"
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