import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import ImagePreview from "#/common/fields/ImagePreview"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import ImageField from "#/common/fields/Image"
import InputField from "#/common/fields/Input"
import { Card, CardContent } from "#/ui/card"
import { Separator } from "#/ui/separator"
import { Mail } from "lucide-react"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useClientForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormClientSectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormClientSection = ({ id, theme, onChange }: FormClientSectionProps) => {
  const { open, methods, isLoading, setOpen, onConfirm, handleSubmit } = useClientForm(id, () => { onChange('table') })

  if (isLoading) return <Skeleton theme={theme} />
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
                title={id ? "Edición de cliente" : "Registro de cliente"}
                description={id ? "Actualiza los datos del cliente" : "Diligencia la información para registrar un cliente"}
              />
              <CardContent className="py-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    name="name"
                    type="text"
                    theme={theme}
                    label="Nombre"
                    placeholder="Nombre del cliente"
                  />
                  <InputField
                    icon={Mail}
                    type="email"
                    name="email"
                    label="Email"
                    theme={theme}
                    readOnly={!!id}
                    placeholder="Email del cliente"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    type="text"
                    name="phone"
                    theme={theme}
                    label="Teléfono"
                    placeholder="Teléfono del cliente"
                  />
                  <InputField
                    name="nit"
                    label="NIT"
                    type="text"
                    theme={theme}
                    readOnly={!!id}
                    placeholder="NIT del cliente"
                  />
                </div>

                <div className="md:col-span-5">
                  <div className={cn(!id || methods.getValues('photoUrl') ? 'hidden' : 'block')}>
                    <ImagePreview
                      theme={theme}
                      name="preview"
                      alt="imgEquip"
                      sizeImage='max-w-full max-h-72'
                    />
                  </div>
                  <CardIterable
                    limit={1}
                    theme={theme}
                    name="photoUrl"
                    titleButton={cn(!id ? 'Agregar imagen' : 'Cambiar imagen')}
                    fields={fields.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
                  />
                </div>

                <Separator />

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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fields = [{ name: "photoUrl.file", label: "Imagen del equipo", sizeImage: "w-60 h-60" }]