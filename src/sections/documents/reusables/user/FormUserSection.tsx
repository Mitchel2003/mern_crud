import SubmitFooter from "#/common/elements/SubmitFooter"
import ImagePreview from "#/common/fields/ImagePreview"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import SelectMulti from "#/common/fields/SelectMulti"
import HeaderForm from "#/common/elements/HeaderForm"
import ImageField from "#/common/fields/Image"
import InputField from "#/common/fields/Input"
import { Separator } from "#/ui/separator"
import { CardContent } from "#/ui/card"

import { RoleProps, ThemeContextProps } from "@/interfaces/context.interface"
import { useUserForm } from "@/hooks/core/form/useAuthForm"
import { convertRole, toPlural } from "@/utils/format"
import { FormProvider } from "react-hook-form"
import { Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormUserSectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
  to: RoleProps
}

const FormUserSection = ({ id, to, theme, onChange }: FormUserSectionProps) => {
  const { open, methods, options, setOpen, onConfirm, handleSubmit } = useUserForm(id, to, onChange)
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? `Edición de ${convertRole(to)}` : `Registro de ${convertRole(to)}`}
            description={id ? `Actualiza los datos del ${convertRole(to)}` : `Diligencia la información para registrar un ${convertRole(to)}`}
          />
          {/* -------------------- Card content -------------------- */}
          <CardContent className="py-6 space-y-6">
            <div className={cn('grid gap-4 md:grid-cols-2', !!id && 'hidden')}>
              <InputField
                icon={Mail}
                name="email"
                type="email"
                label="Email"
                theme={theme}
                placeholder="Email del usuario"
              />
              <InputField
                icon={Lock}
                theme={theme}
                type="password"
                name="password"
                label="Contraseña"
                placeholder="Contraseña del usuario"
              />
            </div>

            <Separator className={cn(!!id && 'hidden')} />

            <div className='grid gap-4 md:grid-cols-2'>
              <InputField
                theme={theme}
                type="text"
                label="Nombre"
                name="username"
                placeholder={`Nombre ${convertRole(to)}`}
              />
              <InputField
                theme={theme}
                type="text"
                name="phone"
                label="Telefono"
                placeholder={`Telefono contacto`}
              />
            </div>

            <div className={cn('grid gap-4', to === 'client' || to === 'engineer' ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
              {(to === 'company' || to === 'client') && (
                <InputField
                  theme={theme}
                  type="text"
                  name="nit"
                  label="NIT"
                  placeholder={`Nit ${convertRole(to)}`}
                />
              )}
              <InputField
                readOnly
                value={to}
                name="role"
                label="Rol"
                theme={theme}
                placeholder={`Selecciona el rol`}
              />
              {to !== 'client' && (
                <SelectMulti
                  theme={theme}
                  name="permissions"
                  span="Selecciona varios"
                  options={options.clients}
                  label={`Acceso a clientes`}
                  placeholder={`Selecciona los clientes asociados`}
                />
              )}
            </div>

            <div className={cn('grid gap-4 md:grid-cols-2', to !== 'company' && 'hidden')}>
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

            <div className={cn('md:col-span-5', to !== 'client' && 'hidden')}>
              <div className={cn(!id || methods.getValues('photoImage') ? 'hidden' : 'block')}>
                <ImagePreview
                  theme={theme}
                  alt="imgEquipLogo"
                  name="previewClientImage"
                  sizeImage='max-w-full max-h-72'
                />
              </div>
              <CardIterable
                limit={1}
                theme={theme}
                name="photoImage"
                titleButton={cn(!id ? 'Agregar imagen' : 'Cambiar imagen')}
                fields={fieldsImage.map(field => ({ name: field.name, component: <ImageField {...field} theme={theme} /> }))}
              />
            </div>

            <Separator className={cn(to !== 'company' && 'hidden')} />

            <div className={cn('md:col-span-5', to !== 'company' && 'hidden')}>
              <div className={cn(!id || methods.getValues('photoLogo') ? 'hidden' : 'block')}>
                <ImagePreview
                  theme={theme}
                  alt="imgEquipLogo"
                  name="previewCompanyLogo"
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

            <Separator className={cn(to !== 'company' && 'hidden')} />

            <div className={cn('md:col-span-5', to !== 'company' && 'hidden')}>
              <div className={cn(!id || methods.getValues('photoSignature') ? 'hidden' : 'block')}>
                <ImagePreview
                  theme={theme}
                  alt="imgEquipSignature"
                  name="previewCompanySignature"
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
            <Separator className={cn(to !== 'company' && 'hidden')} />
          </CardContent>

          {/* -------------------- Submit footer -------------------- */}
          <SubmitFooter
            theme={theme}
            to={`/${toPlural(to)}`}
            disabled={!methods.formState.isDirty}
            onCancel={() => { methods.reset(); onChange() }}
          />
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : `Se creará un nuevo ${convertRole(to)}`}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormUserSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fieldsImage = [{ name: "photoImage.file", label: "Logo cliente", sizeImage: "w-60 h-60" }]
const fieldsLogo = [{ name: "photoLogo.file", label: "Imagen del logo", sizeImage: "w-60 h-60" }]
const fieldsSignature = [{ name: "photoSignature.file", label: "Imagen de la firma", sizeImage: "w-60 h-60" }]