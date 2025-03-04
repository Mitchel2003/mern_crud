import { ThemeContextProps } from "@/interfaces/context.interface"
import { useStateForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormStateSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormStateSection = ({ id, theme, onChange }: FormStateSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useStateForm(id, () => { onChange('table') })

  if (isLoading) return <Skeleton theme={theme} />
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
                title={id ? "Edición de departamento" : "Registro de departamento"}
                description={id ? "Actualiza los datos del departamento" : "Diligencia la información para registrar un departamento"}
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo departamento"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormStateSection