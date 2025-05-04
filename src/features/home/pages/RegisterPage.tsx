import FooterSection from "@/features/home/sections/register/FooterSection"
import FormSection from "@/features/home/sections/register/FormSection"
import { useUserForm } from "@/hooks/core/form/useAuthForm"
import { useThemeContext } from "@/context/ThemeContext"
import AlertDialog from "#/common/elements/AlertDialog"
import { useAuthContext } from "@/context/AuthContext"
import HeaderForm from "#/common/elements/HeaderForm"
import { useNavigate } from "react-router-dom"
import { FormProvider } from "react-hook-form"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card } from "#/ui/card"

const RegisterPage = () => {
  const { open, methods, options, setOpen, onConfirm, handleSubmit } = useUserForm()
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => { if (isAuth) navigate('/dashboard') }, [isAuth])
  return (
    <div className={cn("flex justify-center items-center")}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          <Card
            className={cn('relative w-full my-10', 'backdrop-filter backdrop-blur-lg', theme === 'dark'
              ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
              : 'bg-white hover:shadow-purple-500/60'
            )}
          >
            <HeaderForm
              theme={theme}
              title="Registro de usuario"
              className="bg-transparent/0"
              description="Diligencia la información para registrar un usuario"
            />
            <FormSection theme={theme} options={options.clients} />
            <FooterSection theme={theme} />
          </Card>
        </form>
      </FormProvider>

      <AlertDialog
        open={open}
        theme={theme}
        onConfirm={onConfirm}
        onOpenChange={() => setOpen(false)}
        description={`¿Estás seguro? Se creará un nuevo usuario`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        title="Confirmación"
      />
    </div>
  )
}

export default RegisterPage