import FooterSection from '@/features/home/sections/login/FooterSection'
import FormSection from '@/features/home/sections/login/FormSection'
import { useLoginForm } from '@/hooks/core/form/useAuthForm'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import HeaderForm from '#/common/elements/HeaderForm'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '#/ui/card'

const LoginPage = () => {
  const { methods, onSubmit } = useLoginForm()
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => { if (isAuth) navigate('/dashboard') }, [isAuth])
  return (
    <div className={cn("flex justify-center items-center")}>
      <FormProvider {...methods}>
        <form className="relative w-full max-w-md" onSubmit={onSubmit}>
          <Card
            className={cn('relative w-full my-10', 'backdrop-filter backdrop-blur-lg', theme === 'dark'
              ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
              : 'bg-white hover:shadow-purple-500/60'
            )}
          >
            <HeaderForm
              theme={theme}
              title="Bienvenido"
              className="bg-transparent/0"
              description="Ingresa tus credenciales para acceder"
            />
            <FormSection theme={theme} />
            <FooterSection theme={theme} />
          </Card>
        </form>
      </FormProvider>
    </div>
  )
}

export default LoginPage