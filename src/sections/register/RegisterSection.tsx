import { ThemeContextProps } from "@/interfaces/context.interface"
import { useUserForm } from "@/hooks/auth/useAuthForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

import Skeleton from "#/common/skeletons/SkeletonShort"
import AlertDialog from "#/common/elements/AlertDialog"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card } from "#/ui/card"

import FooterSection from "./FooterSection"
import FormSection from "./FormSection"

interface RegisterSectionProps extends ThemeContextProps { id: string | undefined }

const RegisterSection = ({ theme, id }: RegisterSectionProps) => {
  const { open, isLoading, methods, options, setOpen, onConfirm, handleSubmit } = useUserForm(id)

  if (isLoading) return <Skeleton theme={theme} />
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          <Card
            className={cn(
              'relative w-full my-10',
              'backdrop-filter backdrop-blur-lg',
              theme === 'dark'
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
            <FormSection theme={theme} options={options} />
            <FooterSection theme={theme} />
          </Card>
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

export default RegisterSection