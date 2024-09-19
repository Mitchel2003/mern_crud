import { CardHeader, CardTitle, CardDescription } from "#/ui/card";
import { LoginComponentsProps } from '@/interfaces/props.interface';

const LoginHeader = ({ theme }: LoginComponentsProps) => {
  return (
    <CardHeader className="space-y-1">

      <CardTitle
        className={`text-2xl font-bold text-center
          ${theme === 'dark'
            ? 'text-zinc-100'
            : 'text-gray-900'
          }`}
      >
        Bienvenido
      </CardTitle>

      <CardDescription
        className={`text-center
          ${theme === 'dark'
            ? 'text-zinc-400'
            : 'text-gray-500'
          }`}
      >
        Ingresa tus credenciales para acceder
      </CardDescription>

    </CardHeader>
  )
}

export default LoginHeader