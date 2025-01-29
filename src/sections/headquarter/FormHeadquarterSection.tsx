import { ThemeContextProps } from "@/interfaces/context.interface"
import { useHeadquarterForm } from "@/hooks/auth/useLocationForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import HeaderCustom from "#/common/elements/HeaderCustom"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"
import { Separator } from "#/ui/separator"

interface FormHeadquarterSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormHeadquarterSection = ({ id, theme, onChange }: FormHeadquarterSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useHeadquarterForm(id, () => { onChange('table') })
  const countryId = methods.watch('country')
  const stateId = methods.watch('state')

  const states = id ? options?.states : options?.states?.filter((head) => head.country?._id === countryId)
  const cities = id ? options?.cities : options?.cities?.filter((head) => head.state?._id === stateId)

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
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>
                <Separator />

                <HeaderCustom
                  to="component"
                  theme={theme}
                  iconSpan="info"
                  title="Referencias"
                  className="text-2xl font-light"
                  span="Información de la ubicación"
                />
                <SelectField
                  name="client"
                  theme={theme}
                  label="Cliente"
                  placeholder="Selecciona el cliente"
                  options={options.clients?.map((c) => ({ label: c.name, value: c._id })) || []}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <SelectField
                    name="country"
                    theme={theme}
                    label="País"
                    options={options.countries?.map((c) => ({ label: c.name, value: c._id })) || []}
                    placeholder="Selecciona el país"
                  />
                  <SelectField
                    name="state"
                    theme={theme}
                    label="Departamento"
                    options={states?.map((c) => ({ label: c.name, value: c._id })) || []}
                    placeholder="Selecciona el departamento"
                  />
                  <SelectField
                    name="city"
                    theme={theme}
                    label="Ciudad"
                    options={cities?.map((c) => ({ label: c.name, value: c._id })) || []}
                    placeholder="Selecciona la ciudad"
                  />
                </div>
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