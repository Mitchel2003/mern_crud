import { ThemeContextProps } from "@/interfaces/context.interface"
import { SelectOptionProps } from "@/interfaces/props.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormStateSectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  options: SelectOptionProps[]
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormStateSection = ({
  theme,
  methods,
  options,
  onSubmit,
  onChange,
  isUpdate,
}: FormStateSectionProps) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="flex justify-center">
          <Card
            className={cn(
              'relative my-10 w-[calc(100%-1rem)] md:max-w-[calc(100%-10rem)]',
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
                options={options}
                placeholder="Selecciona el país"
              />
            </CardContent>
            <SubmitFooter
              theme={theme}
              to="/location/states"
              onCancel={() => { methods.reset(); onChange('table') }}
            />
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormStateSection