import { ThemeContextProps } from "@/interfaces/context.interface"
import { useOfficeForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectMulti from "#/common/fields/SelectMulti"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"

interface FormOfficeSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormOfficeSection = ({ id, theme, onChange }: FormOfficeSectionProps) => {
  const { open, methods, isLoading, optionsHeadquarter, optionsService, setOpen, onConfirm, handleSubmit } = useOfficeForm(id, () => { onChange('table') })

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
                title={id ? "Edición de consultorio" : "Registro de consultorio"}
                description={id ? "Actualiza los datos del consultorio" : "Diligencia la información para registrar un consultorio"}
              />
              <CardContent className="py-6 space-y-6">
                <InputField
                  theme={theme}
                  name="name"
                  label="Nombre"
                  placeholder="Nombre del consultorio"
                  type="text"
                />
                <SelectField
                  label="Sede"
                  theme={theme}
                  name="headquarter"
                  options={optionsHeadquarter}
                  placeholder="Selecciona la sede"
                />
                <SelectMulti
                  theme={theme}
                  name="services"
                  iconSpan="info"
                  label="Servicios"
                  options={optionsService}
                  placeholder="Selecciona los servicios"
                  span="Selecciona varios servicios para este consultorio"
                />
              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/location/offices"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo consultorio"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormOfficeSection