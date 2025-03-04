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

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useCompanyForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormCompanySectionProps extends ThemeContextProps {
  onChange: (value: string) => void
  id: string | undefined
}

const FormCompanySection = ({ id, theme, onChange }: FormCompanySectionProps) => {
  const { open, methods, isLoading, setOpen, onConfirm, handleSubmit } = useCompanyForm(id, () => { onChange('table') })

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
                title={id ? "Edición de proveedor servicios" : "Registro de proveedor servicios"}
                description={id ? "Actualiza los datos del proveedor de servicios" : "Diligencia la información para registrar un proveedor de servicios"}
              />
              <CardContent className="py-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    theme={theme}
                    name="name"
                    type="text"
                    label="Nombre"
                    placeholder="Nombre del proveedor"
                  />
                  <InputField
                    theme={theme}
                    type="text"
                    name="nit"
                    label="NIT"
                    placeholder="Nit del proveedor"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    theme={theme}
                    type="text"
                    name="invima"
                    label="Invima"
                    placeholder="Invima del proveedor"
                  />
                  <InputField
                    theme={theme}
                    type="text"
                    name="profesionalLicense"
                    label="Licencia profesional"
                    placeholder="Licencia del proveedor"
                  />
                </div>

                <div className="md:col-span-5">
                  <div className={cn(!id || methods.getValues('photoLogo') ? 'hidden' : 'block')}>
                    <ImagePreview
                      theme={theme}
                      name="previewLogo"
                      alt="imgEquipLogo"
                      sizeImage='max-w-full max-h-72'
                    />
                  </div>
                  <CardIterable
                    limit={1}
                    theme={theme}
                    name="photoLogo"
                    titleButton={cn(!id ? 'Agregar imagen logo' : 'Cambiar imagen logo')}
                    fields={fieldsLogo.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
                  />
                </div>

                <Separator />

                <div className="md:col-span-5">
                  <div className={cn(!id || methods.getValues('photoSignature') ? 'hidden' : 'block')}>
                    <ImagePreview
                      theme={theme}
                      name="previewSignature"
                      alt="imgEquipSignature"
                      sizeImage='max-w-full max-h-72'
                    />
                  </div>
                  <CardIterable
                    limit={1}
                    theme={theme}
                    name="photoSignature"
                    titleButton={cn(!id ? 'Agregar imagen firma' : 'Cambiar imagen firma')}
                    fields={fieldsSignature.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
                  />
                </div>

                <Separator />

              </CardContent>
              <SubmitFooter
                theme={theme}
                to="/companies"
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
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo proveedor de servicios"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormCompanySection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fieldsLogo = [{ name: "photoLogo.file", label: "Imagen del logo", sizeImage: "w-60 h-60" }]
const fieldsSignature = [{ name: "photoSignature.file", label: "Imagen de la firma", sizeImage: "w-60 h-60" }]