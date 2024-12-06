import HeaderForm from "#/common/elements/HeaderForm"
import { Card } from "#/ui/card"

import FooterSection from "./FooterSection"
import FormSection from "./FormSection"

import { ThemeContextProps } from "@/interfaces/context.interface"
import { useRegisterForm } from "@/hooks/auth/useRegisterForm"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

const RegisterSection = ({ theme }: ThemeContextProps) => {
  const { methods, onSubmit } = useRegisterForm()
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card
          className={cn(
            'relative w-full my-10',
            'transition-all duration-300',
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
          <FormSection theme={theme} />
          <FooterSection theme={theme} />
        </Card>
      </form>
    </FormProvider>
  )
}

export default RegisterSection