import SubmitFooter from "#/common/elements/SubmitFooter"
import Skeleton from "#/common/skeletons/SkeletonLarge"
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
import { useUserForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormUserSectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
  role: RoleProps
}

const FormUserSection = ({ id, role, theme, onChange }: FormUserSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useUserForm(id, role, onChange)
  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? `Edición de ${toStr(role)}` : `Registro de ${toStr(role)}`}
            description={id ? `Actualiza los datos del ${toStr(role)}` : `Diligencia la información para registrar un ${toStr(role)}`}
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
                placeholder={`Nombre ${toStr(role)}`}
              />
              <InputField
                theme={theme}
                type="text"
                name="phone"
                label="Telefono"
                placeholder={`Telefono contacto`}
              />
            </div>

            <div className={cn('grid gap-4', role === 'client' ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
              {(role === 'company' || role === 'client') && (
                <InputField
                  theme={theme}
                  type="text"
                  name="nit"
                  label="NIT"
                  placeholder={`Nit ${toStr(role)}`}
                />
              )}
              <InputField
                readOnly
                theme={theme}
                name="role"
                label="Rol"
                value={role}
                placeholder={`Selecciona el rol`}
              />
              {role !== 'client' && (
                <SelectMulti
                  theme={theme}
                  name="permissions"
                  label="Acceso a clientes"
                  options={options.clients}
                  placeholder={`Selecciona el cliente`}
                  span="Selecciona varios"
                />
              )}
            </div>

            <div className={cn('grid gap-4 md:grid-cols-2', role !== 'company' && 'hidden')}>
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

            <div className={cn('md:col-span-5', role !== 'client' && 'hidden')}>
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

            <Separator className={cn(role !== 'company' && 'hidden')} />

            <div className={cn('md:col-span-5', role !== 'company' && 'hidden')}>
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

            <Separator className={cn(role !== 'company' && 'hidden')} />

            <div className={cn('md:col-span-5', role !== 'company' && 'hidden')}>
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
            <Separator className={cn(role !== 'company' && 'hidden')} />
          </CardContent>

          {/* -------------------- Submit footer -------------------- */}
          <SubmitFooter
            theme={theme}
            to={`/${toPlural(role)}`}
            disabled={!methods.formState.isDirty}
            onCancel={() => { methods.reset(); onChange() }}
          />
        </form>
      </FormProvider >

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : `Se creará un nuevo ${toStr(role)}`}`}
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

/** To convert rol to spanish */
const toStr = (str: RoleProps) => {
  switch (str) {
    case "client": return "cliente"
    case "company": return "proveedor de servicios"
    case "engineer": return "ingeniero"
    case "admin": return "administrador"
    default: return str
  }
}

/** To convert on plural */
const toPlural = (str: string) => str.slice(-1) === 'y' ? str.slice(0, -1) + 'ies' : str + 's'