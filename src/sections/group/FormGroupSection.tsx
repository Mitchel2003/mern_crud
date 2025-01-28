import { ThemeContextProps } from "@/interfaces/context.interface"
import { useGroupForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectMulti from "#/common/fields/SelectMulti"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormGroupSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormGroupSection = ({ id, theme, onChange }: FormGroupSectionProps) => {
  const { open, methods, isLoading, optionsService, setOpen, onConfirm, handleSubmit } = useGroupForm(id, () => { onChange('table') })

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
                title={id ? "Edición de grupo" : "Registro de grupo"}
                description={id ? "Actualiza los datos del grupo" : "Diligencia la información para registrar un grupo"}
              />
              <CardContent className="py-6 space-y-6">
                <InputField
                  theme={theme}
                  name="name"
                  label="Nombre"
                  placeholder="Nombre del grupo"
                  type="text"
                />
                <SelectMulti
                  theme={theme}
                  name="services"
                  iconSpan="info"
                  label="Servicios"
                  options={optionsService}
                  placeholder="Selecciona los servicios"
                  span="Selecciona varios servicios para este grupo"
                />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/location/groups"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo grupo"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormGroupSection