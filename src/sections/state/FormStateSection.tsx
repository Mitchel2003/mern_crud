import { Country, ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { useQueryLocation } from "@/hooks/useLocationQuery"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormStateSectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormStateSection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate,
}: FormStateSectionProps) => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: countries } = fetchAllLocations<Country>('country')
  const countriesOptions = countries?.map((e) => ({ label: e.name, value: e._id })) || []

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => { onSubmit(e); onChange('table') }}>
        <div className="flex justify-center">
          <Card
            className={cn(
              'relative w-[calc(100%-1rem)] md:w-[calc(100%-20rem)] my-10',
              'backdrop-filter backdrop-blur-lg',
              theme === 'dark'
                ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
                : 'bg-white hover:shadow-purple-500/60'
            )}
          >
            <HeaderForm
              theme={theme}
              title={isUpdate ? "Edición de departamento" : "Registro de departamento"}
              description={isUpdate ? "Actualiza los datos del departamento" : "Diligencia la información para registrar un departamento"}
            />
            <CardContent className="py-6 space-y-6">
              <InputField
                theme={theme}
                name="name"
                label="Nombre"
                placeholder="Nombre del departamento"
                type="text"
              />
              <SelectField
                theme={theme}
                label="País"
                name="country"
                placeholder="Selecciona el país"
                options={countriesOptions || []}
              />
            </CardContent>
            <SubmitFooter
              theme={theme}
              to="/location/states"
              onChange={() => { onChange('table'); methods.reset() }}
            />
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormStateSection