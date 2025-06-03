import { RoleProps, ThemeContextProps, User } from "@/interfaces/context.interface"
import { convertRole, toPlural } from "@/constants/format.constants"
import { typeClassCollection } from "@/constants/values.constants"
import { useUserForm } from "@/hooks/core/form/useAuthForm"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { useAuthContext } from "@/context/AuthContext"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { Mail, Lock, User2 } from "lucide-react"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

import SubmitFooter from "#/common/elements/SubmitFooter"
import ImagePreview from "#/common/fields/ImagePreview"
import CardIterable from "#/common/fields/CardIterable"
import AlertDialog from "#/common/elements/AlertDialog"
import SelectMulti from "#/common/fields/SelectMulti"
import HeaderForm from "#/common/elements/HeaderForm"
import ImageField from "#/common/fields/Image"
import InputField from "#/common/fields/Input"
import Select from "#/common/fields/Select"
import { Separator } from "#/ui/separator"
import { CardContent } from "#/ui/card"

interface FormUserSectionProps extends ThemeContextProps {
  id: string | undefined
  onChange: () => void
  to: RoleProps
}

const FormUserSection = ({ id, to, theme, onChange }: FormUserSectionProps) => {
  const { open, methods, options, setOpen, onConfirm, handleSubmit } = useUserForm(id, to, onChange)
  const { user: credentials } = useAuthContext()
  const belongsTo = methods.watch('belongsTo')
  const queryUser = useQueryUser()
  const isMobile = useIsMobile()

  const clients = options.clients
  const { data: company, isLoading: isLoading } = queryUser.fetchUserById<User>(belongsTo as string, { enabled: !!belongsTo })

  /**
   * Dynamically filter available clients based on selected company permissions
   * - If company selected: filter out clients already in company permissions
   */
  const availableClients = useMemo(() => {
    if (!company || isLoading) return clients
    return clients.filter(client => { //all clients available if not permissions yet
      if (!company.permissions || company.permissions.length === 0) return true
      return company.permissions.includes(client.value)
    })
  }, [isLoading, company, clients])

  const prefix = to === 'company' && belongsTo ? 'sub-' : ''
  const typeClass = useMemo(() => company?.classification?.length ? company.classification : typeClassCollection, [company])
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? `Edición de ${prefix}${convertRole(to)}` : `Registro de ${convertRole(to)}`}
            description={id ? `Actualiza los datos del ${prefix}${convertRole(to)}` : `Diligencia la información para registrar un ${convertRole(to)}`}
          />
          {/* -------------------- Card content -------------------- */}
          <CardContent className="py-6 space-y-6">
            {/** Section authentication */}
            {!id && ( //if update, don´t can change (firebase)
              <div className='grid gap-4 md:grid-cols-2'>
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
            )}

            {!id && <Separator className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200')} />}

            {/** Section basic information */}
            <div className='grid gap-4 md:grid-cols-3'>
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
              <InputField
                label="Cargo"
                theme={theme}
                name="position"
                placeholder={`Indica el cargo`}
              />
            </div>

            {/** Section role (hidden field) */}
            <InputField
              hidden
              readOnly
              value={to}
              name="role"
              label="Rol"
              theme={theme}
              placeholder="Selecciona el rol"
            />

            {/** Section access (conditional) */}
            <div className={cn('grid gap-4', to === 'company' && 'md:grid-cols-2')}>
              {/** Section nit (available for company and client) */}
              {(to === 'company' || to === 'client') && (
                <InputField
                  theme={theme}
                  type="text"
                  name="nit"
                  label="NIT"
                  placeholder={`Nit ${convertRole(to)}`}
                />
              )}
              {/** Section permissions (available for company and collaborator) */}
              {(to !== 'client' || belongsTo) && (
                <SelectMulti
                  theme={theme}
                  name="permissions"
                  label="Acceso a clientes"
                  options={availableClients}
                  span={isLoading ? 'Cargando clientes disponibles...' : 'Selecciona varios'}
                  placeholder={isLoading ? 'Cargando...' : `Selecciona los clientes asociados`}
                />
              )}
            </div>

            {/** Section references relationships (company and collaborator) */}
            {to !== 'client' && (
              <div className={cn(`grid gap-4 ${belongsTo && 'md:grid-cols-2'}`)}>
                <Select
                  theme={theme}
                  iconSpan='warn'
                  name="belongsTo"
                  label="Asignado a"
                  options={options.companies}
                  placeholder="Selecciona el usuario"
                  span={to === 'collaborator' ? 'Aquí asignas este colaborador a un contratista' : `Aquí conviertes este usuario en sub-prestador (${credentials?.role === 'admin' ? 'opcional' : 'obligatorio'})`}
                />
                {belongsTo && (
                  <SelectMulti
                    theme={theme}
                    iconSpan='alert'
                    name="classification"
                    label="Clasificación"
                    placeholder="Selecciona la clasificación"
                    span="Selecciona las clasificaciones del usuario (obligatorio)"
                    options={typeClass?.map(type => ({ label: type, value: type, icon: User2 })) || []}
                  />
                )}
              </div>
            )}

            {/** Section references metadata (company) */}
            {to === 'company' && (
              <div className='grid gap-4 md:grid-cols-2'>
                <InputField
                  theme={theme}
                  type="text"
                  name="invima"
                  label="Invima"
                  placeholder="Invima del prestador de servicio"
                />
                <InputField
                  theme={theme}
                  type="text"
                  name="profesionalLicense"
                  label="Licencia profesional"
                  placeholder="Licencia del prestador de servicio"
                />
              </div>
            )}

            {/** Section files (client - logo) */}
            {to === 'client' && (
              <>
                <div className={cn(!id || methods.getValues('photoImage') ? 'hidden' : 'block')}>
                  <ImagePreview
                    theme={theme}
                    alt="imgLogo"
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
              </>
            )}

            {to === 'company' && <Separator className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200')} />}

            {to === 'company' && (
              <div className='grid gap-4 md:grid-cols-2'>
                {/** Section files (company - logo) */}
                <div className='space-y-2'>
                  <div className={cn(!id || methods.getValues('photoLogo') ? 'hidden' : 'block')}>
                    <ImagePreview
                      theme={theme}
                      alt="imgLogo"
                      name="previewCompanyLogo"
                      sizeImage='max-w-full max-h-56'
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

                <Separator className={cn(!isMobile && 'hidden', theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200')} />

                {/** Section files (company - signature) */}
                <div className="space-y-2">
                  <div className={cn(!id || methods.getValues('photoSignature') ? 'hidden' : 'block')}>
                    <ImagePreview
                      theme={theme}
                      alt="imgSignature"
                      name="previewCompanySignature"
                      sizeImage='max-w-full max-h-56'
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
              </div>
            )}

            <Separator className={cn(theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200')} />
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