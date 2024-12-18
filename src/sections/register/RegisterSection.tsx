import RegisterSkeleton from "#/common/skeletons/RegisterSkeleton"
import HeaderForm from "#/common/elements/HeaderForm"
import { Card } from "#/ui/card"

import FooterSection from "./FooterSection"
import FormSection from "./FormSection"

import { Headquarter, ThemeContextProps } from "@/interfaces/context.interface"
import { useRegisterForm } from "@/hooks/auth/useRegisterForm"
import { useQueryLocation } from "@/hooks/useLocation"
import { FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"

const RegisterSection = ({ theme }: ThemeContextProps) => {//working here...
  const { methods, onSubmit } = useRegisterForm()
  const { fetchAllLocations } = useQueryLocation()
  const { data: locations, isLoading } = fetchAllLocations('headquarter')

  if (isLoading) return <RegisterSkeleton theme={theme} />

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
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
          <FormSection theme={theme} locations={locations as Headquarter[]} />
          <FooterSection theme={theme} />
        </Card>
      </form>
    </FormProvider>
  )
}

export default RegisterSection