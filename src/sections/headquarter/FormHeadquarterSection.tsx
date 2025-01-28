import { ThemeContextProps } from "@/interfaces/context.interface"
import { useHeadquarterForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormHeadquarterSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormHeadquarterSection = ({ id, theme, onChange }: FormHeadquarterSectionProps) => {
  const { open, methods, isLoading, optionsClient, optionsCity, setOpen, onConfirm, handleSubmit } = useHeadquarterForm(id, () => { onChange('table') })

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
                title={id ? "Edición de sede" : "Registro de sede"}
                description={id ? "Actualiza los datos de la sede" : "Diligencia la información para registrar una sede"}
              />
              <CardContent className="py-6 space-y-6">
                <InputField
                  theme={theme}
                  name="name"
                  label="Nombre"
                  placeholder="Nombre de la sede"
                  type="text"
                />
                <InputField
                  theme={theme}
                  name="address"
                  label="Dirección"
                  placeholder="Dirección de la sede"
                  type="text"
                />
                <SelectField
                  name="client"
                  theme={theme}
                  label="Cliente"
                  options={optionsClient}
                  placeholder="Selecciona el cliente"
                />
                <SelectField
                  name="city"
                  theme={theme}
                  label="Ciudad"
                  options={optionsCity}
                  placeholder="Selecciona la ciudad"
                />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/location/headquarters"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará una nueva sede"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormHeadquarterSection 