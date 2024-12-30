import { State, ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { useQueryLocation } from "@/hooks/useLocationQuery"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormCitySectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormCitySection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate,
}: FormCitySectionProps) => {
  const { fetchAllLocations } = useQueryLocation()
  const { data: states } = fetchAllLocations<State>('state')
  const statesOptions = states?.map((e) => ({ label: e.name, value: e._id })) || []

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
              title={isUpdate ? "Edición de ciudad" : "Registro de ciudad"}
              description={isUpdate ? "Actualiza los datos de la ciudad" : "Diligencia la información para registrar una ciudad"}
            />
            <CardContent className="py-6 space-y-6">
              <InputField
                theme={theme}
                name="name"
                label="Nombre"
                placeholder="Nombre de la ciudad"
                type="text"
              />
              <SelectField
                theme={theme}
                name="state"
                label="Departamento"
                placeholder="Selecciona el departamento"
                options={statesOptions || []}
              />
            </CardContent>
            <SubmitFooter
              theme={theme}
              to="/location/cities"
              onChange={() => { onChange('table'); methods.reset() }}
            />
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormCitySection