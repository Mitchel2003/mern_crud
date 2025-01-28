import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCountryForm } from '@/hooks/auth/useLocationForm'
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from '#/common/skeletons/DashboardSkeleton'
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from '#/common/elements/AlertDialog'
import HeaderForm from "#/common/elements/HeaderForm"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormCountrySectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormCountrySection = ({ id, theme, onChange }: FormCountrySectionProps) => {
  const { methods, isLoading, open, setOpen, onConfirm, handleSubmit } = useCountryForm(id, () => { onChange('table') })

  if (isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <Card
              className={cn(
                'relative w-[calc(100%-1rem)] md:max-w-[calc(100%-10rem)]',
                'backdrop-filter backdrop-blur-lg',
                theme === 'dark'
                  ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
                  : 'bg-white hover:shadow-purple-500/60'
              )}
            >
              <HeaderForm
                theme={theme}
                title={id ? "Edición de país" : "Registro de país"}
                description={id ? "Actualiza los datos del país" : "Diligencia la información para registrar un país"}
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo país"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormCountrySection