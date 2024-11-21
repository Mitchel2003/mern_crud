import HeaderForm from '#/reusables/elements/HeaderForm'
import { Card } from '#/ui/card'

import FooterSection from './FooterSection'
import FormSection from './FormSection'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { useLoginForm } from '@/hooks/auth/useLoginForm'
import { useAuthContext } from '@/context/AuthContext'
import { FormProvider } from 'react-hook-form'
import { cn } from '@/lib/utils'

const LoginSection = ({ theme }: ThemeContextProps) => {
  const { errors: authErrors = [] } = useAuthContext()
  const { methods, onSubmit } = useLoginForm()

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        {/* -------------------- Render errors -------------------- */}
        {authErrors.map((e, i) => (
          <div key={i} className="bg-red-500 text-white text-center my-2 p-2 rounded">
            {e}
          </div>
        ))}

        {/* -------------------- Container card -------------------- */}
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
            title="Bienvenido"
            className="bg-transparent/0"
            description="Ingresa tus credenciales para acceder"
          />
          <FormSection theme={theme} />
          <FooterSection theme={theme} />
        </Card>
      </form>
    </FormProvider>
  )
}

export default LoginSection
