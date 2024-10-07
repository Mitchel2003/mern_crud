import { zodResolver } from "@hookform/resolvers/zod"

import HeaderSection from "#/reusables/elements/HeaderText"
import FooterSection from "./FooterSection"
import FormSection from "./FormSection"
import { Card } from "#/ui/card"

import { loginSchema, LoginFormProps } from "@/schemas/loginSchema"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { FormProvider, useForm } from "react-hook-form"
import { useAuthContext } from "@/context/AuthContext"

interface LoginProps extends ThemeContextProps { }

const Login = ({ theme }: LoginProps) => {
  const { signin, errors: authErrors = [] } = useAuthContext()

  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = methods.handleSubmit(async (data) => await signin(data))

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        {/* render errors */}
        {authErrors.map((e, i) => (
          <div key={i} className="bg-red-500 text-white text-center my-2 p-2 rounded">
            {e}
          </div>
        ))}

        {/* Container card */}
        <Card className={`relative w-full transition-all duration-300 backdrop-filter backdrop-blur-lg
          ${theme === 'dark'
            ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
            : 'bg-white hover:shadow-purple-500/60'
          }`}
        >
          {/* Header text */}
          <HeaderSection
            title="Bienvenido"
            description="Ingresa tus credenciales para acceder"
            theme={theme}
          />

          {/* Form */}
          <FormSection theme={theme} />

          {/* Footer */}
          <FooterSection theme={theme} />

        </Card>
      </form>
    </FormProvider>
  )
}

export default Login