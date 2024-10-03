import { LoginComponentsProps } from '@/interfaces/props.interface'
import { LoginFormProps } from '@/schemas/loginSchema'

import InputField from '#/curriculum/fields/Input'
import { CardContent } from '#/ui/card'
import { Button } from '#/ui/button'

import { LogIn, Lock, UserPlus, ChevronRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

const Form = ({ theme }: LoginComponentsProps) => {
  const { control, formState: { errors } } = useFormContext<LoginFormProps>()

  return (
    <CardContent className="space-y-6">
      {/* Email section */}
      <InputField
        name="email"
        type="email"
        label="Correo electrónico"
        control={control}
        placeholder="@example.com"
        icon={LogIn}
        theme={theme}
        error={errors.email?.message}
      />
      {/* Password section */}
      <InputField
        name="password"
        type="password"
        label="Contraseña"
        control={control}
        icon={Lock}
        theme={theme}
        error={errors.password?.message}
      />
      {/* Submit section */}
      <Button
        type="submit"
        className={`w-full mt-6 transition-all duration-300 transform hover:scale-105 text-white
          ${theme === 'dark'
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-purple-800 hover:bg-purple-900'
          }`}
      >
        Iniciar sesión <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
      {/* Register section */}
      <Button
        type="button"
        className={`w-full mt-3 transition-all duration-300 transform hover:scale-105 text-white
          ${theme === 'dark'
            ? 'bg-purple-800 hover:bg-purple-900'
            : 'bg-purple-400 hover:bg-purple-500'
          }`}
      >
        Registrarse <UserPlus className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  )
}

export default Form