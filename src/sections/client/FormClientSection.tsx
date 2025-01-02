import { ThemeContextProps } from "@/interfaces/context.interface"
import { useClientForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"
import { Mail } from "lucide-react"

interface FormClientSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormClientSection = ({ id, theme, onChange }: FormClientSectionProps) => {
  const { open, methods, isLoading, setOpen, onConfirm, handleSubmit } = useClientForm(id, () => { onChange('table') })

  if (isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
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
                title={id ? "Edición de ciudad" : "Registro de ciudad"}
                description={id ? "Actualiza los datos de la ciudad" : "Diligencia la información para registrar una ciudad"}
              />
              <CardContent className="py-6 space-y-6">
                <InputField
                  theme={theme}
                  name="name"
                  type="text"
                  label="Nombre"
                  placeholder="Nombre del cliente"
                />
                <InputField
                  theme={theme}
                  icon={Mail}
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Email del cliente"
                />
                <InputField
                  theme={theme}
                  type="text"
                  name="phone"
                  label="Teléfono"
                  placeholder="Teléfono del cliente"
                />
                <InputField
                  theme={theme}
                  name="nit"
                  label="NIT"
                  type="text"
                  placeholder="NIT del cliente"
                />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/clients"
                disabled={!methods.formState.isDirty}
                onCancel={() => { methods.reset(); onChange('table') }}
              />
            </Card>
          </div>
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo cliente"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormClientSection