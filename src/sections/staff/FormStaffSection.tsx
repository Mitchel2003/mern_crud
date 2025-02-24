import DashboardSkeleton from "#/common/skeletons/DashboardSkeleton"
import SubmitFooter from "#/common/elements/SubmitFooter"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import SelectField from "#/common/fields/Select"
import InputField from "#/common/fields/Input"
import { CardContent } from "#/ui/card"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { FooterFormProps } from "@/interfaces/props.interface"
import { useUserForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { Lock, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FormStaffSectionProps extends ThemeContextProps {
  footer?: React.ComponentType<FooterFormProps>
  id: string | undefined
  onChange?: () => void
}

const FormStaffSection = ({ id, theme, onChange, footer: Footer }: FormStaffSectionProps) => {
  const { open, methods, isLoading, options, setOpen, onConfirm, handleSubmit } = useUserForm(id, onChange)

  if (isLoading) return <DashboardSkeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          {/* -------------------- Header form -------------------- */}
          <HeaderForm
            theme={theme}
            title={id ? "Edición de usuario" : "Registro de usuario"}
            description={id ? "Actualiza los datos del usuario" : "Diligencia la información para registrar un usuario"}
          />

          {/* -------------------- Content form -------------------- */}
          <CardContent className="py-6 space-y-6">

            <div className="grid gap-4 md:grid-cols-2">
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

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                theme={theme}
                type="text"
                name="username"
                label="Nombre de usuario"
                placeholder="Nombre completo"
              />
              <InputField
                type="text"
                name="phone"
                theme={theme}
                label="Teléfono"
                placeholder="Teléfono disponible"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Rol"
                name="role"
                theme={theme}
                options={[
                  { value: "engineer", label: "Ingeniero" },
                  { value: "admin", label: "Administrador" },
                ]}
                placeholder="Rol del usuario"
              />
              <SelectField
                name="company"
                theme={theme}
                label="Empresa"
                options={options}
                placeholder="Empresa del usuario"
              />
            </div>
          </CardContent>


          {/* -------------------- Footer -------------------- */}
          {!Footer ? (
            <SubmitFooter
              theme={theme}
              to="/form/maintenance"
              disabled={!methods.formState.isDirty}
              onCancel={() => { methods.reset(); onChange?.() }}
            />
          ) : (
            <Footer
              onReset={methods.reset}
              onSubmit={handleSubmit}
              isDirty={methods.formState.isDirty}
              isSubmitting={methods.formState.isSubmitting}
            />
          )}
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? ${id ? "Se guardará los cambios" : "Se creará un nuevo usuario"}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </>
  )
}

export default FormStaffSection