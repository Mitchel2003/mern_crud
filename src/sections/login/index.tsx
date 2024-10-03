import { zodResolver } from "@hookform/resolvers/zod"

import HeaderText from "#/login/reusables/HeaderText"
import { Card } from "#/ui/card"
import Footer from "./Footer"
import Form from "./Form"

import { loginSchema, LoginFormProps } from "@/schemas/loginSchema"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { useAuthContext } from "@/context/AuthContext"
import { FormProvider, useForm } from "react-hook-form"

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
        {authErrors.map((e, i) => (
          <div key={i} className="bg-red-500 text-white text-center my-2 p-2 rounded">
            {e}
          </div>
        ))}

        <Card className={`relative w-full transition-all duration-300 backdrop-filter backdrop-blur-lg
          ${theme === 'dark'
            ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
            : 'bg-white hover:shadow-purple-500/60'
          }`}
        >
          <HeaderText
            title="Bienvenido"
            description="Ingresa tus credenciales para acceder"
            theme={theme}
          />
          <Form theme={theme} />
          <Footer theme={theme} />
        </Card>
      </form>
    </FormProvider>
  )
}

export default Login