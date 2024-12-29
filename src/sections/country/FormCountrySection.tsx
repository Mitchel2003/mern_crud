import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormCountrySectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate?: boolean
}

const FormCountrySection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate
}: FormCountrySectionProps) => {
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
              title={isUpdate ? "Edición de país" : "Registro de país"}
              description={isUpdate ? "Actualiza los datos del país" : "Diligencia la información para registrar un país"}
            />
            <CardContent className="py-6 space-y-6">
              <InputField
                theme={theme}
                name="name"
                label="Nombre del país"
                placeholder="Nombre del país"
                type="text"
              />
            </CardContent>
            <SubmitFooter
              theme={theme}
              to="/location/countries"
              onChange={() => { onChange('table'); methods.reset() }}
            />
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormCountrySection