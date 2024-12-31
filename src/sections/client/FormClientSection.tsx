import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"
import { Mail } from "lucide-react"

interface FormClientSectionProps extends ThemeContextProps {
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: string) => void
  methods: UseFormReturn<any>
  isUpdate: boolean
}

const FormClientSection = ({
  theme,
  methods,
  onSubmit,
  onChange,
  isUpdate,
}: FormClientSectionProps) => {
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
              title={isUpdate ? "Edición de cliente" : "Registro de cliente"}
              description={isUpdate ? "Actualiza los datos del cliente" : "Diligencia la información para registrar un cliente"}
            />
            <CardContent className="py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  theme={theme}
                  name="name"
                  label="Nombre"
                  placeholder="Nombre cliente"
                  type="text"
                />
                <InputField
                  icon={Mail}
                  theme={theme}
                  name="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  theme={theme}
                  name="phone"
                  type="text"
                  label="Teléfono"
                  placeholder="Teléfono del cliente"
                />
                <InputField
                  theme={theme}
                  name="nit"
                  label="NIT"
                  placeholder="NIT del cliente"
                  type="text"
                />
              </div>
            </CardContent>
            <SubmitFooter
              theme={theme}
              to="/clients"
              onChange={() => { onChange('table'); methods.reset() }}
            />
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}

export default FormClientSection