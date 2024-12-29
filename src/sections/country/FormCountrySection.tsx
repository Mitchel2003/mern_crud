import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { Card } from "#/ui/card"

interface FormCountrySectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
}

const FormCountrySection = ({ theme, methods, onSubmit, onChange }: FormCountrySectionProps) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card
          className={cn(
            'relative w-full my-10',
            'backdrop-filter backdrop-blur-lg',
            theme === 'dark'
              ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
              : 'bg-white hover:shadow-purple-500/60'
          )}
        >
          <HeaderForm
            theme={theme}
            title="Registro de usuario"
            className="bg-transparent/0"
            description="Diligencia la información para registrar un usuario"
          />
          <InputField
            theme={theme}
            name="name"
            label="Nombre del país"
            placeholder="Nombre del país"
            type="text"
          />
          <SubmitFooter
            theme={theme}
            to="/location/countries"
            onChange={() => { onChange('table'); methods.reset() }}
          />
        </Card>
      </form>
    </FormProvider>
  )
}

export default FormCountrySection